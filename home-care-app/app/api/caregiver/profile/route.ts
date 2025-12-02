import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "CAREGIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.caregiverProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "CAREGIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { yearsExperience, skills } = body as {
    yearsExperience?: number;
    skills?: string[];
  };

  const profile = await prisma.caregiverProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Caregiver profile not found." },
      { status: 404 }
    );
  }

  const updated = await prisma.caregiverProfile.update({
    where: { userId: session.user.id },
    data: {
      yearsExperience:
        typeof yearsExperience === "number" ? yearsExperience : profile.yearsExperience,
      skills: Array.isArray(skills) ? skills : profile.skills,
      verificationStatus: "APPROVED",
    },
  });

  return NextResponse.json({ profile: updated });
}


