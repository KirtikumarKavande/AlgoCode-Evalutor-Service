import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefination";
import { SubmissionPayload } from "../types/submissionPayload";
import runCpp from "../containers/run.cpp.docker";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    console.log("Handler of the job called");
    // console.log(this.payload);
    if (job) {
      const keys = Object.keys(this.payload);
      if (this.payload[keys[0]].language === "CPP") {
        // console.log(this.payload)
        const response = await runCpp(
          this.payload[keys[0]].code,
          this.payload[keys[0]].inputCase
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
