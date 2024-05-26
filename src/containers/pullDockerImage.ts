import Dockerode from "dockerode";

let docker = new Dockerode();

async function pullDockerImage(imageName: string) {
  try {
    return new Promise((resolve, reject) => {
      docker.pull(
        imageName,
        function (err: Error, stream: NodeJS.ReadableStream) {
          if (err) {
            reject(err);
          }
          docker.modem.followProgress(
            stream,
            (err, response) => {
              if (err) {
                reject(err);
                throw err;
              }
              resolve(response);
              console.log(response);
            },
            (event) => {
              console.log(event.status);
            }
          );
        }
      );
    });
  } catch (error) {
    console.log("error while fetching image", error);
  }
}

export default pullDockerImage;
