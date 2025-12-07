import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

export const updateProfile = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("You are not authorized");
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      const user = await pool.query(
        `
      SELECT * FROM users WHERE email=$1
      `,
        [decoded.email]
      );

      if (user.rows.length === 0) {
        throw new Error("User not found!");
      }
      req.user = decoded;

      const targetUserId = req.params.userId;

    //   console.log(targetUserId);
    //   console.log(decoded);



      if (decoded.role === "admin") {
        return next();
      }

      if (decoded.id == targetUserId) {
        return next();
      } else {
        throw new Error("You are not authorized");
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};
