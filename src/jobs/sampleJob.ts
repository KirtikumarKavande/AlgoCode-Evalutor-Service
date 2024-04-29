import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefination";

class SampleJob implements IJob {
  name: string;
  payload?: Record<string, unknown> | undefined;
  constructor(payload: Record<string, unknown>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }
  handle = () => {
    console.log("job handler called");
  };
  failed = (job?: Job) => {
    if (job) {
      console.log("job failed", job);
    }
  };
}

export default SampleJob;
