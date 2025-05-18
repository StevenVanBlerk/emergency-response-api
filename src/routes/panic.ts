import express from "express";
import { handlePanic } from "../controllers/panicController";

const router = express.Router();

router.post("/", handlePanic);

export default router;
