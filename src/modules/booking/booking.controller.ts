import { bookingServices } from "./booking.service";
import { Request, Response } from "express";

const addBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.addBooking(req.body);
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const getBooking = async (req: Request, res: Response) => {
  try {
    let result;
    const loggedUser = req.user!;
    const userId = loggedUser.id;
    const userRole = loggedUser.role;

    if (userRole === "admin") {
      result = await bookingServices.getAllBookings();
    } else {
      result = await bookingServices.getSingleBooking(userId);
    }
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  addBooking,
  getBooking 
};
