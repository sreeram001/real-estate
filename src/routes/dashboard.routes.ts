/*
  File: user.routes.ts
  Author: Sree Ram
  Description:This Folder handles all the user routes endpoint.
  Created: Jun 08, 2024
*/
import { Router } from "express";
import dashBoardController from "../controllers/dashboard.controller";

// This Routes For Login
class LoginRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/", dashBoardController.dashBoard);
  }
}

export default new LoginRoutes().router;
