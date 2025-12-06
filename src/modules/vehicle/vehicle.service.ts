import config from "../../config";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IVehicle {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status?: "available" | "booked";
}

const addVehicle = async (payload: IVehicle) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status = "available",
  } = payload;

  if (!["car", "bike", "van", "SUV"].includes(type)) {
    throw new Error("Type must be 'car', 'bike', 'van', or 'SUV'");
  }

  if (daily_rent_price <= 0) {
    throw new Error("Price must be a positive number");
  }

  if (availability_status !== "available" && availability_status !== "booked") {
    throw new Error("Status must be either 'available' or 'booked' ");
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );


  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);

  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;

  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  
  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;

  return result;
};


export const vehicleServices = {
  addVehicle,
  getAllVehicles,
  getSingleVehicle,
};
