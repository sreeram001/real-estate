import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes";
import { connectToDatabase } from "./config/db";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "*",
      exposedHeaders: ["*"],
      allowedHeaders: ["*"]
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // sequelize.sync({ force: true }).then(() => {
    // Data base and redis connectin
    (async () => {
      const isDbConnected = await connectToDatabase();
      isDbConnected && app.emit("ready");
    })();
  }
}
