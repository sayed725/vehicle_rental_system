import express, { Request, Response } from 'express'
import { userController } from './user.controller';


const router = express.Router();


router.get("/", userController.getUser)
router.get("/:id", userController.getSingleUser)
router.put("/:id", userController.updateUser)




export const userRoutes = router;