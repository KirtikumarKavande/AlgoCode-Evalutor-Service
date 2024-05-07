import { CreateSubmissionDto } from "../dtos/createSubmisstionDto";
import { Request, Response } from "express";
export function addSubmission(req: Request, res: Response) {
  const submission = req.body as CreateSubmissionDto;

  return res.json({
    success: true,
    error: {},
    message: "submitted successfully",
    data: submission,
  });
}
