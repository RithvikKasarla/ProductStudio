import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreCaregiverForIntake } from "@/lib/matching/scoreCaregiver";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "FAMILY") {
    return NextResponse.json(
      { error: "Only family users can view matches." },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const intakeIdParam = url.searchParams.get("intakeId");

  let intake =
    intakeIdParam &&
    (await prisma.intakeRequest.findFirst({
      where: {
        id: intakeIdParam,
        userId: session.user.id,
      },
    }));

  if (!intake) {
    intake = await prisma.intakeRequest.findFirst({
      where: {
        userId: session.user.id,
        status: "OPEN",
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!intake) {
    return NextResponse.json(
      { caregivers: [], intakeId: null },
      { status: 200 }
    );
  }

  const caregivers = await prisma.caregiverProfile.findMany({
    include: {
      user: true,
    },
  });

  const scored = caregivers
    .map((cg) => {
      const score = scoreCaregiverForIntake(intake!, cg);
      const matchLabel =
        score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

      const yearsExperience = cg.yearsExperience ?? undefined;
      let hourlyRate = cg.hourlyRate;
      if (!hourlyRate) {
        switch (cg.caregiverType) {
          case "RN": hourlyRate = 110; break;
          case "LPN": hourlyRate = 90; break;
          case "CNA": hourlyRate = 70; break;
          case "HHA": hourlyRate = 60; break;
          default: hourlyRate = 60;
        }
      }

      return {
        id: cg.id,
        userId: cg.userId,
        name: cg.user.name,
        caregiverType: cg.caregiverType,
        yearsExperience,
        hourlyRate,
        skills: cg.skills,
        languages: cg.languages,
        matchScore: score,
        matchLabel,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return NextResponse.json({
    caregivers: scored,
    intakeId: intake.id,
  });
}


