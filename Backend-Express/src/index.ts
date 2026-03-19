import dotenv from 'dotenv';
import { setupSwagger } from './swagger';
import express, { Request, Response } from 'express';
import "reflect-metadata";
import routes from './routes/index';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsConfig } from './config/cors.config';
import { startScheduleCronJob } from './jobs/schedule.cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsConfig));

setupSwagger(app);

app.use("/", routes);

startScheduleCronJob();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
