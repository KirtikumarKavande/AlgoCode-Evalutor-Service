import { JAVA_IMAGE } from "../utilities/constants";
import createContainer from "./containerFactory";
import decodeDockerStreamOutput from "./dockerHelper";

async function runJava(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > Main.java && javac Main.java && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | java Main`;
  console.log(runCommand);
  // const javaDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
  const javaDockerContainer = await createContainer(JAVA_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);
  await javaDockerContainer.start();
  const loggerStream = await javaDockerContainer.logs({
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

  await javaDockerContainer.remove();
}

export default runJava;
