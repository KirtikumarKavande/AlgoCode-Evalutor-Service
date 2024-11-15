export const PYTHON_IMAGE = "python:3.8-slim";
export const JAVA_IMAGE = "openjdk:11-jdk-slim"; // docker pull openjdk:11-jdk-slim
export const CPP_IMAGE = "gcc:latest"; // docker pull gcc:latest
export const NODE_IMAGE = "node:18-slim"; // docker pull node:18-slim

export const submission_queue = "SubmissionQueue";



// size of header in docker stream it has info about the stream==>output or error stream 
// and length of data that is coming out 
export const DOCKER_STREAM_HEADER_SIZE = 8;
