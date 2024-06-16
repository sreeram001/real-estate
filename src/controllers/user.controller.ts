/*
  File: user.controller.ts
  Author: Sree Ram N
  Description:This Folder handles all the controllers of the users.
  Created: Jun 09, 2024
*/
import { Request, Response } from "express";
import userService from "../services/user.service";
import { userBodyRequest, loginRequest } from "../types/user.t";

export default class LoginController {
  static async registerUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const userRequestBody: userBodyRequest = req.body;
    try {
      await userService.registerUser(userRequestBody);
      // await userService.saveSession(data.token, data.id)
      return res.status(200).json({
        status: 200,
        message: "Registered Successfully"
        // data: data,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        message: error.errors[0].message,
        error: error
      });
    }
  }

  static async loginUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const loginRequestBody: loginRequest = req.body;
    try {
      const { data, error } = await userService.loginUser(loginRequestBody);

      if (data) {
        if (error === 2 || error === 1) {
          return res.status(200).json({
            status: 400,
            message: data.message,
            data: data.token
          });
        }

        await userService.saveSession(data.token, data.id);
        return res.status(200).json({
          status: 200,
          message: data.message,
          data: data.token
        });
      }
      return res.status(401).json({
        status: 401,
        message: error,
        error: error
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        message: error.errors[0],
        error: error
      });
    }
  }

  static async updateSession(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        error: "Authorization token missing"
      });
    }
    try {
      const { data, error } = await userService.sessionUpdate(token);
      if (error) {
        return res.status(400).json({
          status: 400,
          message: error,
          error: error
        });
      }
      return res.status(200).json({
        status: 200,
        message: "session updated successfully",
        data: data
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        message: error.errors[0],
        error: error
      });
    }
  }
  static async logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];
    // if (!token) {
    //   return res.status(401).json({
    //     status: "failure",
    //     message: "Unauthorized",
    //     error: "Authorization token missing"
    //   });
    // }

    try {
      await userService.logout(req.token || "");
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        message: error.errors[0],
        error: error
      });
    }
    return res.status(200).json({
      status: 200,
      message: "user logout successfully",
      data: "user logout successfully"
    });
  }

  static async forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      await userService.updatePassword(req.body.password, req.userId || 0);
      await userService.sessionCreate(req.userId || 0, req.token || "");
    } catch (error: any) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Password reset successfully"
    });
  }
}
