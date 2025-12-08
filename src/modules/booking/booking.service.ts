import { pool } from "../../config/db";
import { IUser } from "../auth/auth.service";

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
      type: vehicle.type,
    },
  };
};

const getAllBookings = async () => {
  const result = await pool.query(`SELECT 
  b.id,
  b.customer_id,
  b.vehicle_id,
  b.rent_start_date,
  b.rent_end_date,
  b.total_price,
  b.status,
  json_build_object(
    'name', c.name,
    'email', c.email
  ) AS customer,
  json_build_object(
    'vehicle_name', v.vehicle_name,
    'registration_number', v.registration_number
  ) AS vehicle
FROM bookings b
JOIN users c ON b.customer_id = c.id
JOIN vehicles v ON b.vehicle_id = v.id;`);

  return result;
};

const getSingleBooking = async (customerId: string) => {
  const result = await pool.query(
    `SELECT 
  b.id,
  b.customer_id,
  b.vehicle_id,
  b.rent_start_date,
  b.rent_end_date,
  b.total_price,
  b.status,
  json_build_object(
    'vehicle_name', v.vehicle_name,
    'registration_number', v.registration_number,
    'type' , v.type
  ) AS vehicle
FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
WHERE customer_id = $1`,
    [customerId]
  );

  if(result.rows.length === 0){
    throw new Error("You have no active Bookings");
  }

  return result;
};






const updateBooking = async (
  payload: Record<string, unknown>,
  bookingId: string,
  userId: string
) => {
  const { status } = payload;

  const userResult = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    userId,
  ]);
  const user = userResult.rows[0];

  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  const booking = bookingResult.rows[0];

  if (!user) throw new Error("User not found");
  if (!booking) throw new Error("Booking not found");

  const now = new Date();
  const startDate = new Date(booking.rent_start_date);

  // console.log(now)
  // console.log(startDate)

  if (!status) {
    throw new Error("Status will be cancelled or returned");
  }

  if (status !== "cancelled" && status !== "returned") {
    throw new Error("Status must be 'cancelled' or 'returned'");
  }

  // customer cancelled before start date

  if (status === "cancelled") {
    if (booking.customer_id !== user.id) {
      throw new Error("You can only cancel your own bookings");
    }

    if (now >= startDate) {
      throw new Error("You Cannot cancel booking after or on start date");
    }

    if (booking.status === "returned" || booking.status === "cancelled") {
      throw new Error("Booking is already cancelled or returned");
    }

    const cancelBooking = await pool.query(
      `UPDATE bookings 
         SET status = 'cancelled', updated_at = NOW() 
         WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    // console.log(booking.vehicle_id);

    await pool.query(
      `UPDATE vehicles 
         SET availability_status = 'available', updated_at = NOW()
         WHERE id = $1`,
      [booking.vehicle_id]
    );

    delete cancelBooking.rows[0].created_at;
    delete cancelBooking.rows[0].updated_at;

    return {
      success: true,
      message: "Booking cancelled successfully",
      data: cancelBooking.rows[0],
    };
  }

  // admin mark returned

  if (status === "returned") {
    if (user.role !== "admin") {
      throw new Error("Only admins can mark bookings as returned");
    }

    if (booking.status === "returned" || booking.status === "cancelled") {
      throw new Error("Booking is already cancelled or returned");
    }

    // console.log(bookingId, booking.vehicle_id);

    const returnBooking = await pool.query(
      `UPDATE bookings 
         SET status = 'returned', updated_at = NOW() 
         WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    const updateStatus = await pool.query(
      `UPDATE vehicles 
         SET availability_status = 'available', updated_at = NOW()
         WHERE id = $1 RETURNING *`,
      [booking.vehicle_id]
    );

    // console.log(returnedBooking, returnVehicle)

    const returnedBookingData = returnBooking.rows[0];
    const returnedVehicleData = updateStatus.rows[0];

    // console.log(returnedVehicleData)

    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        id: returnedBookingData.id,

        customer_id: returnedBookingData.customer_id,
        vehicle_id: returnedBookingData.vehicle_id,

        rent_start_date: returnedBookingData.rent_start_date,
        rent_end_date: returnedBookingData.rent_end_date,
        total_price: returnedBookingData.total_price,
        status: returnedBookingData.status,

        vehicle: {
          availability_status: returnedVehicleData.availability_status,
        },
      },
    };
  }
};

export const bookingServices = {
  addBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
};
