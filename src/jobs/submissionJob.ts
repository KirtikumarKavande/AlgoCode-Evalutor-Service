import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefination";
import { SubmissionPayload } from "../types/submissionPayload";
import runJavaScript from "../containers/run.javascript.docker";
import evaluatorQueue from "../producers/evalutorQueue.producer";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
      this.payload = payload;
      this.name = this.constructor.name;
  }
  handle = async (job?: Job) => {
    if (job) {
      const key = Object.keys(this.payload)[0];
      console.log("Full payload:", this.payload);
      console.log("Payload key:", key);
      console.log("Submission payload:", this.payload[key]);
      
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].code;
      const userId = this.payload[key].userId;
      const submissionId = this.payload[key].submissionId;
      const testCases = this.payload[key].testCases;

      console.log("Code to execute:", code);
      console.log("Language:", codeLanguage);
      console.log("Test cases:", testCases);

      if (codeLanguage === "javascript") {
        const response = await runJavaScript(
          code,
          testCases
        );
        console.log("output", response);
        evaluatorQueue({userId,submissionId,testCaseResult:response})
      }
    }
  };

  failed = (job?: Job): void => {
    console.log("Job failed",job);
  };
}
