import express from "express";
const app = express();
import cors from "cors";
import testRouter from "./controllers/test.js";
import authRouter from "./routes/authRouter.js";
import countryRouter from "./routes/countryRouter.js";
import courseRouter from "./routes/courseRouter.js";
import studentRouter from "./routes/studentRouter.js";

app.use(express.json());

app.use(cors());
app.use("/api/test", testRouter);
app.use("/api", courseRouter)
app.use("/api", studentRouter);

//Everything under this requires auth
app.use("/auth", authRouter);
app.use("/api", countryRouter);



app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

export default app;
