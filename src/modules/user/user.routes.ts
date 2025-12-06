import express, { Request, Response } from 'express'
import { userController } from './user.controller';


const router = express.Router();

// /api/v1/user
router.get("/", userController.getUser)
router.get("/:id", userController.getSingleUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)




export const userRoutes = router;