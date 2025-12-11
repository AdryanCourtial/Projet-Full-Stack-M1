import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Project",
      version: "1.0.0",
      description: "Documentation of my Express API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
