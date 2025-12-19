import dotenv from 'dotenv';
import { setupSwagger } from './swagger';
import express, { Request, Response } from 'express';

import routes from './routes/index';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

setupSwagger(app);

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
