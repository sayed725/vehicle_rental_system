import express, { Request, Response } from 'express'
import { authController } from './auth.controller';


const router = express.Router();

// /api/v1/auth
router.post("/signup", authController.signUpUser)

router.post("/signin", authController.signInUser)






export const authRoutes = router;