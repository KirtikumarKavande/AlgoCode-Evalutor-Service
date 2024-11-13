// runJavaScript.ts
import {NODE_IMAGE } from "../utilities/constants";

import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullDockerImage from "./pullDockerImage";


async function runJavaScript(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log("Initialising a new Node.js docker container");
  
  await pullDockerImage(NODE_IMAGE);

  // Store the code in a variable that will be accessible in the eval scope
  const completeCode = `
  const userCode = \`${code}\`;  // Store the actual code
  
  ${code}  // Execute the function definition

  const readline = require("readline").createInterface({
      input: process.stdin
  });

  const testCases = [];

  readline.on("line", (line) => {
      const inputs = line.split(" ").map(Number);
      testCases.push(inputs);
  });

  readline.on("close", () => {
      testCases.forEach(inputs => {
          try {
              // Use userCode instead of code
              const functionMatch = /function\\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\\s*\\(/.exec(userCode);
              const functionName = functionMatch ? functionMatch[1] : null;
              if (functionName) {
                  const result = eval(functionName + "(...inputs)");
                  console.log(result);
              }
          } catch (err) {
              console.error(\`Error running test case \${inputs}: \${err.message}\`);
          }
      });
  });`;

  const runCommand = `echo '${completeCode.replace(/'/g, `'\\"`)}' > main.js && echo '${inputTestCase}' | node main.js`;

  const nodeDockerContainer = await createContainer(NODE_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand
  ]);

  await nodeDockerContainer.start();
  console.log("Started the docker container");

  const loggerStream = await nodeDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true
  });

  loggerStream.on('data', (chunk:Buffer) => {
      rawLogBuffer.push(chunk);
  });

  const response = await new Promise((res) => {
      loggerStream.on('end', () => {
          const completeBuffer = Buffer.concat(rawLogBuffer);
          const decodedStream = decodeDockerStream(completeBuffer);
          res(decodedStream);
      });
  });

  await nodeDockerContainer.remove();
  return response;
}


export default runJavaScript;