import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefination";
import { SubmissionPayload } from "../types/submissionPayload";
import runJavaScript from "../containers/run.javascript.docker";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
      this.payload = payload;
      this.name = this.constructor.name;
  }
  handle = async (job?: Job) => {
    // console.log(this.payload);
    if (job) {
      const key = Object.keys(this.payload)[0];
    console.log("Handler of the job called", this.payload);
    const codeLanguage = this.payload[key].language;
    const code = this.payload[key].code;
    const inputTestCase = this.payload[key].inputCase;
    const outputTestCase = this.payload[key].outputCase;
      if (job && codeLanguage === "javascript") {
        // console.log(this.payload)
        const response = await runJavaScript(
          code,
          inputTestCase,
          outputTestCase

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
