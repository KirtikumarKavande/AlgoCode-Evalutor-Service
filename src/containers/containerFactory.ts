let Docker = require("dockerode");

async function createContainer(imageName: string, cmdExecutable: string[]) {
  const docker = new Docker();

  const container = await docker.createContainer({
    Image: imageName,
    Cmd: cmdExecutable,

    AttachStdin: true, //allows to send input to the container  inform of stream
    AttachStdout: true, //allows to receive output from the container     inform of stream
    AttachStderr: true, //allows to receive error output from the container     inform of stream

    Tty: false,
    OpenStdin: true,
  });

  return container;
}

export default createContainer;
