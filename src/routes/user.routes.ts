/*
  File: user.routes.ts
  Author: Sree Ram
  Description:This Folder handles all the user routes endpoint.
  Created: Jun 08, 2024
*/
import { Router } from "express";
import userController from "../controllers/user.controller";
import { ApiHeaderAuthentication } from "../middleware/authentication";

// This Routes For Login
class LoginRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  
  intializeRoutes() {
    this.router.post("/register", userController.registerUser);
    this.router.post("/login", userController.loginUser);
  }
}

export default new LoginRoutes().router;
