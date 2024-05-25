import express from "express";
import serverConfig from "./config/server.config";
import bodyParser from "body-parser";
import apiRoutes from "./routes";
import runJava from "./containers/run.java.docker";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());

app.use("/api", apiRoutes);

app.listen(serverConfig.PORT, () => {
  console.log("server running on PORT", serverConfig.PORT);
  const code = `
  import java.util.*;

  public class Main {
      public static void main(String[] args) {
          Scanner scn = new Scanner(System.in);
          int input = scn.nextInt();
          System.out.println("input value given by user:" + input);
          for (int i = 0; i < input; i++) {
              System.out.println(i);
          }
      }
  }
  
`;

  const inputCase = `100
`;
  runJava(code, inputCase);
});
