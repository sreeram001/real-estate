/*
  File: login.controller.ts
  Author: Sree Ram N
  Description:This Folder handles all the controllers of the users.
  Created: April 28, 2024
*/
import express, { Request, Response } from "express";
// This function add members in the joggle_singup_table and triggers webhooks.ts //
import userService from "../services/user.service"
import { userBodyRequest, loginRequest } from "../types/user.t"
interface requestBody {
    email: string;
    mobile_no: number;
    user_type: string;
    location_details: JSON;
}
export default class LoginController {
    static async registerUser(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const userBodyRequest: userBodyRequest = req.body;
        try {
            const data = await userService.registerUser(userBodyRequest);
            return res.status(201).json({
                status: "success",
                message: "Registered Successfully",
                data: data,
            });
        }
        catch (error: any) {
            // console.log(error.errors[0].ValidationErrorItem.message,"testt");
            return res.status(500).json({
                status: "failure",
                message: error.errors[0].message,
                error: error,
            });
        }

    }
    static async loginUser(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const loginRequest: loginRequest = req.body;
        try {
            const { data, error } = await userService.loginUser(loginRequest);
            if (error) {
                return res.status(400).json({
                    status: "failure",
                    message: error,
                    error: error,
                });
            }
            return res.status(200).json({
                status: "success",
                message: "login successfully",
                data: data,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: "failure",
                message: error.errors[0],
                error: error,
            });
        }
    }
}
