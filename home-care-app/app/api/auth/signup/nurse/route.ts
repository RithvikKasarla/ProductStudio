import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const nurseSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  licenseType: z.enum(["RN", "LPN", "CNA", "HHA"]),
  password: z.string().min(6),
  hourlyRate: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = nurseSignupSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Invalid input",
        details: parseResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, email, phone, licenseType, password, hourlyRate } =
    parseResult.data;

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "CAREGIVER",
      caregiverProfile: {
        create: {
          caregiverType: licenseType,
          hourlyRate: hourlyRate ?? null,
          skills: [],
          languages: [],
          boroughsServed: [],
        },
      },
    },
    include: {
      caregiverProfile: true,
    },
  });

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      caregiverProfileId: user.caregiverProfile?.id ?? null,
    },
    { status: 201 }
  );
}


