import express from "express";
import serverConfig from "./config/server.config";
import bodyParser from "body-parser";
import apiRoutes from "./routes";
import runCpp from "./containers/run.cpp.docker";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use("/api", apiRoutes);

app.listen(serverConfig.PORT, () => {
  console.log("server running on PORT", serverConfig.PORT);
  const userCode = `
  
  class Solution {
    public:
    vector<int> permute() {
        vector<int> v;
        v.push_back(10);
        return v;
    }
  };
`;

const code = `
#include<iostream>
#include<vector>
#include<stdio.h>
using namespace std;

${userCode}

int main() {

  Solution s;
  vector<int> result = s.permute();
  for(int x : result) {
    cout<<x<<" ";
  }
  cout<<endl;
  return 0;
}
`;

const inputCase = `10
`;

runCpp(code, inputCase);
});
