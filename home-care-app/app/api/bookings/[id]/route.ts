import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ParamsPromise = Promise<{ id: string }>;

export async function PATCH(
  req: NextRequest,
  context: { params: ParamsPromise }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "CAREGIVER") {
    return NextResponse.json(
      { error: "Only caregivers can update booking status." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  const bookingId = id;

  const body = await req.json();
  const { status } = body as { status?: "ACCEPTED" | "DECLINED" };

  if (!status) {
    return NextResponse.json(
      { error: "status is required." },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.caregiverUserId !== session.user.id) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      bookingStatus: status,
    },
  });

  return NextResponse.json({ booking: updated });
}



