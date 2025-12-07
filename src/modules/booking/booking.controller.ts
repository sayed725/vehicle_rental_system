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
    });
  }
};

export const bookingController = {
  addBooking,
};