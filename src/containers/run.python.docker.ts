import { PYTHON_IMAGE } from "../utilities/constants";
import createContainer from "./containerFactory";
import decodeDockerStreamOutput from "./dockerHelper";

async function runPython(code: string) {
  const rawLogBuffer:Buffer[]=[]
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "python3",
    "-c",
    code,
    "stty -echo",
  ]);
  await pythonDockerContainer.start();
  const loggerStream = await pythonDockerContainer.logs({
    stdout: true,
    stderr: true,
    follow: true,
    timestamps: false,
  });

  loggerStream.on("data", (chunk:Buffer) => {
    rawLogBuffer.push(chunk);
  })

  loggerStream.on("end", () => {
const completeBuffer=Buffer.concat(rawLogBuffer)
const decodedStream=decodeDockerStreamOutput(completeBuffer)
console.log(decodedStream)


    console.log(rawLogBuffer);
  });

  return pythonDockerContainer;
}

export default runPython;
