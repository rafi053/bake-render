import express from "express";
import { createServer } from 'http';
const app = express();
const httpServer = createServer(app);

const PORT = 3000;

app.get("/test", (req, res) => {
  res.send("Hello from the test server!");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
