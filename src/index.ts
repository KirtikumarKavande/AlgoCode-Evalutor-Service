import express from "express";
import serverConfig from "./config/server.config";
import bodyParser from "body-parser";
import apiRoutes from "./routes";
import runPython from "./containers/run.python.docker";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use("/api", apiRoutes);

app.listen(serverConfig.PORT, () => {
  console.log("server running on PORT", serverConfig.PORT);
  const code = `print("Hello")`;
  runPython(code);
});
