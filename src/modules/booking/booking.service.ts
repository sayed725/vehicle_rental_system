import { pool } from "../../config/db";

interface IBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: Date;
  rent_end_date: Date;
}

const addBooking = async (payload: IBooking) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("All fields are required");
  }

  let status = "";

  const customerInfo = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    customer_id,
  ]);
  const vehicleInfo = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  const vehicle = vehicleInfo.rows[0];
  const customer = customerInfo.rows[0];

  if (customer.length === 0) {
    throw new Error("Customer not found");
  }

  if (vehicle.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (startDate >= endDate) {
    throw new Error("Invalid date range");
  }


  const number_of_days: number = Math.ceil(
    (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const total_price = Number((vehicle.daily_rate * number_of_days).toFixed(2));

  status = "active";

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING * `,
    [customer_id, vehicle_id, startDate, endDate, total_price, status]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return result;
};

export const bookingServices = {
  addBooking,
};
