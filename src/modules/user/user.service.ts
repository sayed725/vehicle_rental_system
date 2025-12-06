import { pool } from "../../config/db";

interface UpdateUser {
  name?: string;
  email?: string;
  phone?: string;
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


const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const { name, email, phone, role } = payload as UpdateUser;

  const lowerCaseEmail = email?.toLowerCase();

  if ( role && role !== "admin" && role !== "customer") {
    throw new Error("Role must be either 'admin' or 'customer'");
  }

  // console.log("Updating user with ID:", id, "with data:", payload);

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
    [name, lowerCaseEmail, phone, role, id]
  );

  delete result.rows[0].password

  return result;
};

export const userServices = {
  getUser,
  getSingleUser,
  updateUser,
};
