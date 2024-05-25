import { CPP_IMAGE } from "../utilities/constants";
import createContainer from "./containerFactory";
import decodeDockerStreamOutput from "./dockerHelper";

async function runCpp(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | ./main`;
  console.log(runCommand);
  const CppDockerContainer = await createContainer(CPP_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);
  await CppDockerContainer.start();
  const loggerStream = await CppDockerContainer.logs({
    stdout: true,
    stderr: true,
    follow: true,
    timestamps: false,
  });

  loggerStream.on("data", (chunk: Buffer) => {
    rawLogBuffer.push(chunk);
  });
  await new Promise((res) => {
    loggerStream.on("end", () => {
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStreamOutput(completeBuffer);
      console.log(rawLogBuffer);

      console.log(decodedStream);
      res(decodedStream);
    });
  });

  await CppDockerContainer.remove();
}

export default runCpp;
