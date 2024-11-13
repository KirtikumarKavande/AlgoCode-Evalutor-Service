import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefination";
import { SubmissionPayload } from "../types/submissionPayload";
import runJavaScript from "../containers/run.javascript.docker";

export default class SubmissionJob implements IJob {
  name: string;
  payload?: Record<string, string> ;
  // payload: Record<string, SubmissionPayload>;
  // constructor(payload: Record<string, SubmissionPayload>) {
  constructor(payload: SubmissionPayload) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    // console.log(this.payload);
    if (job) {
      // const keys = Object.keys(this.payload);
    console.log("Handler of the job called", this.payload);

      if (job && this?.payload?.language === "javascript") {
        // console.log(this.payload)
        const response = await runJavaScript(
          this?.payload?.code,
         "10 20"
        );
        console.log("output", response);
      }

      // console.log(job.name, job.id, job.data);
    }
  };

  failed = (job?: Job): void => {
    console.log("Job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
