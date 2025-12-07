import express, { Request, Response } from 'express'
import { bookingController } from './booking.controller';


const router = express.Router();


router.post("/", bookingController.addBooking)


export const bookingRoutes = router;