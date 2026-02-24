import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000", // client side url
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Skill Bridge");
});

export default app;
