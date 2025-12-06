import { pool } from "../../config/db";
import bcrypt from "bcryptjs";


interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "admin" | "customer";
}

const signUpUser = async (payload: IUser) => {
  const { name, email, password, phone , role = "customer"}= payload;


  const lowerCaseEmail = email.toLowerCase();

   if( (password).length < 6){
    throw new Error("Password must be at least 6 characters long");
   }

   if ( role !== "admin" && role !== "customer") {
    throw new Error("Role must be either 'admin' or 'customer'");
   }
  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, lowerCaseEmail, hashedPass, phone, role]
  );

  delete result.rows[0].password
  

  return result;
};


export const authServices = {
  signUpUser,
};