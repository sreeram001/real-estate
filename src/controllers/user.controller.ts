/*
  File: user.controller.ts
  Author: Sree Ram N
  Description:This Folder handles all the controllers of the users.
  Created: Jun 09, 2024
*/
import express, { Request, Response } from "express";
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
            await userService.saveSession(data.token, data.id)
            return res.status(201).json({
                status: "success",
                message: "Registered Successfully",
                data: data,
            });
        }
        catch (error: any) {
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
            if (data) {
                if (error == 2) {
                    return res.status(200).json({
                        status: "success",
                        message: data.message,
                        data: data.token,
                    });
                }
                await userService.saveSession(data.token, data.id)
                return res.status(200).json({
                    status: "success",
                    message: data.message,
                    data: data.token,
                });
            }
            return res.status(401).json({
                status: "failure",
                message: error,
                error: error,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: "failure",
                message: error.errors[0],
                error: error,
            });
        }
    }

    static async updateSession(req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: "failure",
                message: "Unauthorized",
                error: "Authorization token missing"
            })
        }
        try {
            const { data, error } = await userService.sessionUpdate(token);
            if (error) {
                return res.status(400).json({
                    status: "failure",
                    message: error,
                    error: error,
                });
            }
            return res.status(200).json({
                status: "success",
                message: "session updated successfully",
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
    static async logout(req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: "failure",
                message: "Unauthorized",
                error: "Authorization token missing"
            })
        }

        try {
            await userService.logout(token);
        } catch (error: any) {
            return res.status(500).json({
                status: "failure",
                message: error.errors[0],
                error: error,
            });
        }
        return res.status(200).json({
            status: "success",
            message: "user logout successfully",
            data: "user logout successfully",
        });
    }
}
