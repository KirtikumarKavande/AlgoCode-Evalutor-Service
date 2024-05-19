import { PYTHON_IMAGE } from "../utilities/constants";
import createContainer from "./containerFactory";

async function runPython(code: string) {
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "python3",
    "-c",
    code,
    "stty -echo",
  ]);
  await pythonDockerContainer.start();
  return pythonDockerContainer
}

export default runPython