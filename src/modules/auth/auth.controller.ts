import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signUpUser(req.body);
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signUpUser,
};
