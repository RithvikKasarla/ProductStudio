import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "FAMILY") {
    return NextResponse.json(
      { error: "Only family users can create bookings." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { intakeId, caregiverProfileId } = body as {
    intakeId?: string;
    caregiverProfileId?: string;
  };

  if (!intakeId || !caregiverProfileId) {
    return NextResponse.json(
      { error: "intakeId and caregiverProfileId are required." },
      { status: 400 }
    );
  }

  const intake = await prisma.intakeRequest.findFirst({
    where: {
      id: intakeId,
      userId: session.user.id,
    },
  });

  if (!intake) {
    return NextResponse.json(
      { error: "Intake not found for this user." },
      { status: 404 }
    );
  }

  const caregiverProfile = await prisma.caregiverProfile.findUnique({
    where: { id: caregiverProfileId },
    include: { user: true },
  });

  if (!caregiverProfile || !caregiverProfile.user) {
    return NextResponse.json(
      { error: "Caregiver not found." },
      { status: 404 }
    );
  }

  const hours = intake.hoursPerDay ?? 4;
  const hourlyRate = caregiverProfile.hourlyRate ?? 45;
  const hourlyRateCents = hourlyRate * 100;
  const totalPriceCents = hours * hourlyRateCents;

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

  const booking = await prisma.booking.create({
    data: {
      intakeId: intake.id,
      familyId: session.user.id,
      caregiverProfileId: caregiverProfile.id,
      caregiverUserId: caregiverProfile.userId,
      startTime,
      endTime,
      totalHours: hours,
      hourlyRateCents,
      totalPriceCents,
    },
    include: {
      caregiverProfile: {
        include: { user: true },
      },
      intake: true,
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const scope = url.searchParams.get("scope") ?? "upcoming";

  if (session.user.role === "CAREGIVER") {
    const whereBase = {
      caregiverUserId: session.user.id,
    };

    const bookings = await prisma.booking.findMany({
      where: {
        ...whereBase,
        bookingStatus: scope === "pending" ? "PENDING" : "ACCEPTED",
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        intake: true,
      },
    });

    return NextResponse.json({ bookings });
  }

  // FAMILY view (not currently surfaced in UI, but useful for future)
  const bookings = await prisma.booking.findMany({
    where: {
      familyId: session.user.id,
    },
    orderBy: {
      startTime: "desc",
    },
    include: {
      caregiverProfile: {
        include: { user: true },
      },
      intake: true,
    },
  });

  return NextResponse.json({ bookings });
}


