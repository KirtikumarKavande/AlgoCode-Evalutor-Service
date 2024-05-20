import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utilities/constants";

function decodeDockerStreamOutput(buffer: Buffer): DockerStreamOutput {
  let offset = 0; // this keeps track of current position in the buffer while parsing
  const output: DockerStreamOutput = {
    stdout: "",
    stderr: "",
  };

  while (offset < buffer.length) {
    let typeOfStream = buffer[0];

    let lengthOfData = buffer.readUInt32BE(offset + 4);
    offset += DOCKER_STREAM_HEADER_SIZE;
    if (typeOfStream === 1) {
      output.stdout += buffer.toString("utf-8", offset, offset + lengthOfData);
    }

    if (typeOfStream === 2) {
      output.stderr += buffer.toString("utf-8", offset, offset + lengthOfData);
    }

    offset += lengthOfData;
  }

  return output;
}

export default decodeDockerStreamOutput;
