import express from "express";
import serverConfig from "./config/server.config";
import sampleQueueProducer from "./producers/sampleQueue.producer";
import SampleWorker from "./workers/sample.worker";

const app = express();

app.listen(serverConfig.PORT, () => {
  console.log("server running on PORT", serverConfig.PORT);

  SampleWorker('SampleQueue');

  sampleQueueProducer('SampleJob', {
    name: "kirtikumar",
    company: "Cognizant",
    position: "Full Stack Developer",
    location: "Remote |PUNE"
  });

});
