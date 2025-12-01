import type { CaregiverProfile, IntakeRequest } from "@prisma/client";

export function scoreCaregiverForIntake(
  intake: IntakeRequest,
  caregiver: CaregiverProfile
): number {
  let score = 0;

  const intakeTasks = new Set(
    (intake.tasks ?? []).map((t) => t.toLowerCase())
  );
  const caregiverSkills = caregiver.skills.map((s) => s.toLowerCase());

  let taskMatches = 0;
  for (const skill of caregiverSkills) {
    if (intakeTasks.has(skill)) {
      taskMatches += 1;
    }
  }
  score += taskMatches * 12; // up to ~70% from task fit

  if (typeof caregiver.yearsExperience === "number") {
    score += Math.min(caregiver.yearsExperience * 3, 20);
  }

  if (intake.careLevel === "HIGH") {
    score += 5;
  } else if (intake.careLevel === "MEDIUM") {
    score += 3;
  }

  if (caregiver.verificationStatus === "APPROVED") {
    score += 10;
  }

  return Math.min(score, 100);
}


