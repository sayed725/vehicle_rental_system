import express, { Request, Response } from 'express'
import { vehicleControllers } from './vehicle.controller';
import { auth } from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';


const router = express.Router();


router.post("/",auth(Roles.admin), vehicleControllers.addVehicle)
router.get("/", vehicleControllers.getAllVehicles)
router.get("/:id", vehicleControllers.getSingleVehicle)
router.put("/:id", auth(Roles.admin), vehicleControllers.updateVehicle)
router.delete("/:id", auth(Roles.admin), vehicleControllers.deleteVehicle)




export const vehicleRoutes = router;