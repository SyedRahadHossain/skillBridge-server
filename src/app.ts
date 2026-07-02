import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import router from "../src/routes/index";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

//better auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("SkillBridge API is running 🎓");
});

app.use(notFound);
app.use(errorHandler);

export default app;
