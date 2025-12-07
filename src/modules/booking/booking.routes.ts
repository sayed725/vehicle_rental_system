import express, { Request, Response } from 'express'
import { bookingController } from './booking.controller';
import { auth } from '../../middleware/auth';
import config from '../../config';
import { Roles } from '../auth/auth.constant';
import { updateProfile } from '../../middleware/updateProfile';


const router = express.Router();



router.post("/", auth(Roles.admin, Roles.customer), bookingController.addBooking)
router.get("/", auth(Roles.admin, Roles.customer), bookingController.getBooking)
router.put("/:bookingId", auth(Roles.admin, Roles.customer), bookingController.updateBooking)


export const bookingRoutes = router;