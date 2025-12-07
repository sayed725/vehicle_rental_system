import config from "../../config";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "admin" | "customer";
}

const signUpUser = async (payload: IUser) => {
  const { name, email, password, phone, role = "customer" } = payload;

  const lowerCaseEmail = email.toLowerCase();

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (role !== "admin" && role !== "customer") {
    throw new Error("Role must be either 'admin' or 'customer'");
  }
  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, lowerCaseEmail, hashedPass, phone, role]
  );

  delete result.rows[0].password;

  return result;
};

const signInUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email
  ]);

  //   console.log({ result });
  if (result.rows.length === 0) {
    throw new Error("User not found!");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid Credentials!");
  }
  // const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  //   console.log({token})

  delete user.password;
  delete user.created_at;
  delete user.updated_at;

  return { token, user };
};

export const authServices = {
  signUpUser,
  signInUser,
};
