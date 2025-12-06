import express, { Request, Response } from 'express'
import { authController } from './auth.controller';


const router = express.Router();


router.post("/signup", authController.signUpUser)




export const authRoutes = router;