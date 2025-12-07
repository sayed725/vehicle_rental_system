import express, { Request, Response } from 'express'
import { vehicleControllers } from './vehicle.controller';
import { auth } from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';


const router = express.Router();


router.post("/",auth(Roles.admin), vehicleControllers.addVehicle)
router.get("/", vehicleControllers.getAllVehicles)
router.get("/:vehicleId", vehicleControllers.getSingleVehicle)
router.put("/:vehicleId", auth(Roles.admin), vehicleControllers.updateVehicle)
router.delete("/:vehicleId", auth(Roles.admin), vehicleControllers.deleteVehicle)




export const vehicleRoutes = router;