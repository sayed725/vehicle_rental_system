import { pool } from "../../config/db";

const addBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("All fields are required");
  }

  const customerInfo = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    customer_id,
  ]);
  const vehicleInfo = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  const vehicle = vehicleInfo.rows[0];
  const customer = customerInfo.rows[0];

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);

  const number_of_days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isNaN(number_of_days) || number_of_days <= 0) {
    throw new Error("Invalid rental time!");
  }

  const total_price = Number(vehicle.daily_rent_price * number_of_days);

  const bookingResult = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, 'active') RETURNING * `,
    [customer_id, vehicle_id, startDate, endDate, total_price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  const booking = bookingResult.rows[0];

  return {
    id: booking.id,

    customer_id: customer.id,
    vehicle_id: vehicle.id,

    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: booking.total_price,
    status: booking.status,

    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
      type: vehicle.type
    },
  };
};

const getAllBookings = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);

  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;

  return result;
};

const getSingleBooking = async (customerId: string) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1`,
    [customerId]
  );

  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;
  return result;
};

export const bookingServices = {
  addBooking,
  getAllBookings,
  getSingleBooking,
};
