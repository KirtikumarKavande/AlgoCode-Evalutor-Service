import { Router } from "express";
import { addSubmission } from "../../controller/submisstion.controller";

const submissionRoutes = Router();
submissionRoutes.post("/", addSubmission);

export default submissionRoutes;
