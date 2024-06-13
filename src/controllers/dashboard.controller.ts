/*
  File: dashboard.controller.ts
  Author: Sreeram 
  Description:This Folder handles all the controllers of the dashboard.
  Created: Jun 09, 2024
*/
import express, { Request, Response } from "express";
// import { userBodyRequest, loginRequest } from "../types/user.t"

export default class DashBoardController {
    static async dashBoard(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const data = [{
            "name": "Varsha Promoters",
            "address": "chennai 60008",
            "mobile_no": 9963633229
        }, {
            "name": "Gold Peach Realty",
            "address": "chennai 600032",
            "mobile_no": 9963631122
        }, {
            "name": "Zillo",
            "address": "trichy 600032",
            "mobile_no": 9963631122
        }]
        // console.log(error.errors[0].ValidationErrorItem.message,"testt");
        return res.status(200).json({
            status: "success",
            message: "Real estate list",
            data: data,
        });
    }
}
