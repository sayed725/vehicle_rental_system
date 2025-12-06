import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

interface UpdateUser {
  name?: string;
  email?: string;
  phone?: string;
  role?: "admin" | "customer";
}

interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "admin" | "customer";
}

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};

const updateUser = async (payload: Partial<IUser>, id: string) => {
  const { name, email, password, phone, role } = payload;

  // Build dynamic SET clause and values array
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }

  if (email !== undefined) {
    const lowerCaseEmail = email.toLowerCase();
    updates.push(`email = $${paramIndex++}`);
    values.push(lowerCaseEmail);
  }

  if (password !== undefined) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    updates.push(`password = $${paramIndex++}`);
    values.push(hashedPass);
  }

  if (phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`);
    values.push(phone);
  }

  if (role !== undefined) {
    if (!["admin", "customer"].includes(role)) {
      throw new Error("Role must be either 'admin' or 'customer'");
    }
    updates.push(`role = $${paramIndex++}`);
    values.push(role);
  }

  //  nothing to update
  if (updates.length === 0) {
    throw new Error("No fields provided to update");
  }

  //  updated_at timestamp
  updates.push(`updated_at = NOW()`);

  // last parameter is the user id
  values.push(id);

  const result = await pool.query(
    `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `,
    [...values]
  );


  delete result.rows[0].password
  delete result.rows[0].created_at
  delete result.rows[0].updated_at


  // console.log(updates);
  // console.log(values);

  return result; 
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [id]);
  return result;
};




export const userServices = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser
};
