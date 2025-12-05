import express, { Request, Response } from 'express'
import initDB from './config/db';
import config from './config';

const app = express()
const port = config.port;

app.use(express.json())


// db connection call 
initDB();




app.get('/', (req: Request, res: Response) => {
  res.send('Hello From Car Rental App!')
})

app.get('/test', (req: Request, res: Response) => {
  res.send({
    message: 'Hello from the API!'
  })
})





// not-found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
