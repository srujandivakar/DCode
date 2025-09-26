import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
  title: "DCode Api",
  description: "Comprehensive API documentation for the DCode platform.",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./app.ts"];

swaggerAutogen(outputFile, routes, doc);