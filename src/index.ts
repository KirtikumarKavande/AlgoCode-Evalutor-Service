import express from "express";
import serverConfig from "./config/server.config";
import bodyParser from "body-parser";
import apiRoutes from "./routes";
// import submissionQueueProducer from "./producers/submissionQueue.producer";
import SubmissionWorker from "./workers/submission.worker";
import { submission_queue } from "./utilities/constants";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use("/api", apiRoutes);

app.listen(serverConfig.PORT, () => {
  console.log("server running on PORT", serverConfig.PORT);
   
  // SampleWorker('SampleQueue');
  console.log("reaching here")
  SubmissionWorker(submission_queue);

  
//   const userCode = `
  
//     class Solution {
//       public:
//       vector<int> permute() {
//           vector<int> v;
//           v.push_back(10);
//           return v;
//       }
//     };
//   `;

//   const code = `
//   #include<iostream>
//   #include<vector>
//   #include<stdio.h>
//   using namespace std;
  
//   ${userCode}

//   int main() {

//     Solution s;
//     vector<int> result = s.permute();
//     for(int x : result) {
//       cout<<x<<" ";
//     }
//     cout<<endl;
//     return 0;
//   }
//   `;

// const inputCase = `10
// `;

// submissionQueueProducer({"1234": {
//   language: "CPP",
//   inputCase,
//   code
// }});
});
