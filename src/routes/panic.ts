import express from "express";
import {
  handlePanic,
  getActivePanics,
  getPanicById,
  updatePanicStatus,
} from "../controllers/panicController";

const router = express.Router();

router.post("/", handlePanic);
router.get("/", getActivePanics);
router.get("/:id", getPanicById);
router.patch("/:id", updatePanicStatus);

export default router;
