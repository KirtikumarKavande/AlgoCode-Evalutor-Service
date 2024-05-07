import { Router } from "express";
import { addSubmission } from "../../controller/submisstion.controller";
import { zodValidator } from "../../validator/zodValidator";
import { zodCreateSubmissionValidator } from "../../dtos/createSubmisstionDto";

const submissionRoutes = Router();
submissionRoutes.post(
  "/",
  zodValidator(zodCreateSubmissionValidator),
  addSubmission
);

export default submissionRoutes;
