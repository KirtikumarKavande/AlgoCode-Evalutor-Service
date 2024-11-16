import evaluatorQueue from "../queues/evaluatorQueue";

export default async function (payload: Record<string, unknown>) {
  await evaluatorQueue.add("evolution", payload);
  console.log("Successfully added a new job to evolution");
}
