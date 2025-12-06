import express, { Request, Response } from 'express'
import { userController } from './user.controller';
import { auth } from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';
import { updateProfile } from '../../middleware/updateProfile';


const router = express.Router();

// /api/v1/user
router.get("/", auth(Roles.admin), userController.getUser)
router.get("/:id", userController.getSingleUser)
router.put("/:id", updateProfile(), userController.updateUser)
router.delete("/:id", userController.deleteUser)




export const userRoutes = router;