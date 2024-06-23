import express from "express";
const app = express();
import cors from "cors";
import testRouter from "./controllers/test.js";
import authRouter from "./routes/authRouter.js";
import countryRouter from "./routes/countryRouter.js";
import authMiddleware from "./middleware/authMiddleware.js";

app.use(express.json());

app.use(cors());
app.use("/api/test", testRouter);
app.use("/auth", authRouter);
app.use("/api", countryRouter);

// Simple route to test middleware
app.get("/test-middleware", authMiddleware(), (req, res) => {
  res.json({ message: "Middleware passed", user: req.user });
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

export default app;
