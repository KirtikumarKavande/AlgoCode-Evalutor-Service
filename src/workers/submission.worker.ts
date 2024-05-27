import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/submissionJob";

export default function SubmissionWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {

      // console.log("job name", job.name);
      // console.log("Sample job worker kicking", job.data);
      if (job.name === "submission") {
        const sampleJobInstance = new SubmissionJob(job.data);

        sampleJobInstance.handle(job);

        return true;
      }
    },
    {
      connection: redisConnection,
    }
  );
}
