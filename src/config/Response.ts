import { Response } from "express";

//response function
export default class ResponseFunction {
  // Errror Response //
  static serverError(res: Response, err: any) {
    res.status(500).json({ message: "Internal Server Error", error: err });
    return;
  }
  static unauthorizedError(res: Response, err: any) {
    res.status(401).json({ message: "Uauthorized", error: err });
    return;
  }
  static notAcceptable(res: Response, err: any) {
    res.status(406).json({ message: "Not Acceptable", error: err });
    return;
  }
  static notfound(res: Response, err: any) {
    res.status(404).json({ message: "We Could Not Found Your Data", error: err });
    return;
  }
  // Success Response //
  static Created(res: Response, data: any) {
    res.status(201).json({ message: "Success", data: data });
    return;
  }

  static UserCreated(res: Response, data: any) {
    res.status(201).json({ message: "You Are Successfully Logged In", data: data });
    return;
  }

  static Found(res: Response, data: any) {
    res.status(302).json({ message: "We Found Your Datas", data: data });
    return;
  }
}
