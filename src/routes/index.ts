import { Application } from "express";
import homeRoutes from "./home.routes";
import v1Routes from "./v1.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/home", homeRoutes);
    app.use("/api/v1", v1Routes);
  }
}