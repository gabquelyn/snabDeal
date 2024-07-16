export const swaggerOptions = {
  swaggerDefinition: {
    // openapi: "1.0.0",
    info: {
      title: "SnabDeal",
      description: "SnabDeal API Information",
      version: "1.00",
      contact: {
        name: "Gabriel Arebamen",
        url: "https://github.com/gabquelyn",
        email: "gabquelyn@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3500",
      },
    ],
  },
  apis: ["../routes/*.js"],
};
