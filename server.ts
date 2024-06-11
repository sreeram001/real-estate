import express, { Application } from "express";
import Server from "./src/index";
import config from './src/config/config';
// import { Server, IncomingMessage, ServerResponse } from "http";

const app: Application = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server = new Server(app);
const port=config.port;
let servesHost: any;
app.on("ready", function () {
  servesHost = app.listen(port, () =>
        // eslint-disable-next-line no-console
        console.log(`Server running on port : http://localhost:${port}`)
    );
});

// Shut down the Server and Database Connections
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log("server shut down");
  servesHost.close(() => {
      // mongoConnectionShutDown();
  });
});
