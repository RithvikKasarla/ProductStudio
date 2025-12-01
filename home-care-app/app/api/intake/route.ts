import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CareLevel } from "@prisma/client";

function computeCareLevel(mobility?: string | null, tasks?: string[]): CareLevel | null {
  const taskSet = new Set((tasks ?? []).map((t) => t.toLowerCase()));
  const mobilityLower = mobility?.toLowerCase() ?? "";

  if (
    mobilityLower.includes("wheelchair") ||
    mobilityLower.includes("bedbound") ||
    taskSet.has("bathing") ||
    taskSet.has("toileting") ||
    taskSet.has("transfers")
  ) {
    return "HIGH";
  }

  if (
    mobilityLower.includes("cane") ||
    mobilityLower.includes("walker") ||
    taskSet.has("medication reminders")
  ) {
    return "MEDIUM";
  }

  if (mobilityLower || taskSet.size > 0) {
    return "LOW";
  }

  return null;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "FAMILY") {
    return NextResponse.json({ error: "Only family users can have intake." }, { status: 403 });
  }

  const existing = await prisma.intakeRequest.findFirst({
    where: {
      userId: session.user.id,
      status: "OPEN",
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ intake: existing ?? null });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "FAMILY") {
    return NextResponse.json({ error: "Only family users can submit intake." }, { status: 403 });
  }

  const body = await request.json();

  const {
    whoNeedsCare,
    age,
    mobility,
    tasks,
    hoursPerDay,
    zip,
    timeSlot,
  } = body as {
    whoNeedsCare?: string;
    age?: number;
    mobility?: string;
    tasks?: string[];
    hoursPerDay?: number;
    zip?: string;
    timeSlot?: string;
  };

  if (!whoNeedsCare) {
    return NextResponse.json(
      { error: "whoNeedsCare is required." },
      { status: 400 }
    );
  }

  const careLevel = computeCareLevel(mobility, tasks);

  const existing = await prisma.intakeRequest.findFirst({
    where: {
      userId: session.user.id,
      status: "OPEN",
    },
    orderBy: { createdAt: "desc" },
  });

  const data = {
    whoNeedsCare,
    age: age ?? existing?.age ?? null,
    mobility: mobility ?? existing?.mobility ?? null,
    tasks: tasks ?? existing?.tasks ?? [],
    hoursPerDay: hoursPerDay ?? existing?.hoursPerDay ?? null,
    zip: zip ?? existing?.zip ?? null,
    timeSlot: timeSlot ?? existing?.timeSlot ?? null,
    careLevel: careLevel ?? existing?.careLevel ?? null,
  };

  const intake = existing
    ? await prisma.intakeRequest.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.intakeRequest.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      });

  return NextResponse.json({ intake });
}


