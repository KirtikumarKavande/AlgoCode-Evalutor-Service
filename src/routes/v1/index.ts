import { Router } from "express";
import submissionRoutes from "./submission.routes";


const v1Routes = Router();
v1Routes.use("/submissions", submissionRoutes);

export default v1Routes;
