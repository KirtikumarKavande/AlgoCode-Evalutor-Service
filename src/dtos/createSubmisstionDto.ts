import { z } from "zod";

export type CreateSubmissionDto = z.infer<typeof zodCreateSubmissionValidator>;

export const zodCreateSubmissionValidator = z.object({
  userId: z.string(),
  problemId: z.string(),
  language: z.string(),
  code: z.string(),
});
