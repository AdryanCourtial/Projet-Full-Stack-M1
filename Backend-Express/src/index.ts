import dotenv from 'dotenv';
import { setupSwagger } from './swagger';
import express, { Request, Response } from 'express';

import routes from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setupSwagger(app);

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
