import { NODE_IMAGE } from "../utilities/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullDockerImage from "./pullDockerImage";

async function runJavaScript(
  code: string,
  inputTestCase: string,
  outputTestCase: string
) {
  let nodeDockerContainer = null;
  try {
    const rawLogBuffer: Buffer[] = [];
    console.log("Initialising a new Node.js docker container", inputTestCase);

    await pullDockerImage(NODE_IMAGE);

    const completeCode = `
        const userCode = \`${code}\`;  
        
        ${code}  
      
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

    const runCommand = `echo '${completeCode.replace(
      /'/g,
      `'\\"`
    )}' > main.js && echo '${inputTestCase}' | node main.js`;

    nodeDockerContainer = await createContainer(NODE_IMAGE, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);

    await nodeDockerContainer.start();
    console.log("Started the docker container");

    const loggerStream = await nodeDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true,
    });

    loggerStream.on("data", (chunk: Buffer) => {
      rawLogBuffer.push(chunk);
    });

    const response: any = await new Promise((resolve, reject) => {
      // this timelimit should configurable by problem setter because each lang require different time to execute

      let timerId = setTimeout(() => {
        console.log("timer finished")
        reject({stderr:"Time Limit Exceeded"});
      }, 5000);

      loggerStream.on("end", () => {
        clearTimeout(timerId);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);

        if (decodedStream.stdout) {
          resolve(decodedStream);
        } else {
          reject(decodedStream);
        }
        console.log("decoded stream", decodedStream);
      });
    });

    const result = {
      status:
        outputTestCase.trim().toString() === response.stdout.trim().toString()
          ? "success"
          : "failed",
      result: response.stdout,
    };

    return result;
  } catch (error: any) {
        if(error.stderr==="Time Limit Exceeded"){
          await nodeDockerContainer.kill();
        }
        return { status: "failed", result: error.stderr };
  } finally {
    // Ensure container cleanup happens whether there was an error or not
    if (nodeDockerContainer) {
      try {
        await nodeDockerContainer.remove();
      } catch (cleanupError) {
        console.error("Error cleaning up container:", cleanupError);
      }
    }
  }
}

export default runJavaScript;
