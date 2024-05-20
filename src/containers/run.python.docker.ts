import { promise } from "zod";
import { PYTHON_IMAGE } from "../utilities/constants";
import createContainer from "./containerFactory";
import decodeDockerStreamOutput from "./dockerHelper";

async function runPython(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > test.py && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | python3 test.py`;
  console.log(runCommand);
  // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);
  await pythonDockerContainer.start();
  const loggerStream = await pythonDockerContainer.logs({
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

  await pythonDockerContainer.remove();

}

export default runPython;
