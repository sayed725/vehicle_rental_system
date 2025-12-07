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



const UpdateVehicle = async (payload: Partial<IVehicle>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (vehicle_name !== undefined) {
    updates.push(`vehicle_name = $${paramIndex++}`);
    values.push(vehicle_name);
  }

  if (type !== undefined) {
    if (!["car", "bike", "van", "SUV"].includes(type)) {
      throw new Error("Type must be 'car', 'bike', 'van', or 'SUV'");
    }
    updates.push(`type = $${paramIndex++}`);
    values.push(type);
  }

  if (registration_number !== undefined) {
    updates.push(`registration_number = $${paramIndex++}`);
    values.push(registration_number);
  }

  if (daily_rent_price !== undefined) {
    if (daily_rent_price <= 0) {
      throw new Error("Daily rent price must be a positive number");
    }
    updates.push(`daily_rent_price = $${paramIndex++}`);
    values.push(daily_rent_price);
  }

  if (availability_status !== undefined) {
    if (!["available", "booked"].includes(availability_status)) {
      throw new Error("Status must be either 'available' or 'booked'");
    }
    updates.push(`availability_status = $${paramIndex++}`);
    values.push(availability_status);
  }

  if (updates.length === 0) {
    throw new Error("No fields provided to update");
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);



  const result = await pool.query(
   `
    UPDATE vehicles
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at
  `,[...values])

  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;



  return result;
};



const deleteVehicle = async (id: string) => {

   const booking = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);

   const activeBooking = booking.rows[0];

   if(!activeBooking){
    throw new Error("No Vehicles exists");
   }

   if(activeBooking.availability_status === 'booked'){
     throw new Error("Cannot delete a booked vehicle");
   }
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
  return result;
};


export const vehicleServices = {
  addVehicle,
  getAllVehicles,
  getSingleVehicle,
  UpdateVehicle,
  deleteVehicle,
};
