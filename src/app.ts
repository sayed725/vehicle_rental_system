import express, { Request, Response } from 'express'
import initDB from './config/db';
import config from './config';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/user/user.routes';
import { vehicleRoutes } from './modules/vehicle/vehicle.route';
import { bookingRoutes } from './modules/booking/booking.routes';

const app = express()

app.use(express.json())


// db connection call 
initDB();


// auth endpoints
app.use("/api/v1/auth", authRoutes);


// user endpoints
app.use("/api/v1/users", userRoutes);

// vehicle endpoints
app.use("/api/v1/vehicles", vehicleRoutes);


// booking endpoints
app.use("/api/v1/bookings", bookingRoutes);




app.get('/', (req: Request, res: Response) => {
  res.send('Hello From Car Rental App!')
})



// not-found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});


export default app;
