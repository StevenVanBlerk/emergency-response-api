import express from "express";
import {
  handlePanic,
  getPanicRequests,
  getPanicById,
  updatePanicStatus,
} from "../controllers/panicController";

const router = express.Router();

router.post("/", handlePanic);
router.get("/", getPanicRequests);
router.get("/:id", getPanicById);
router.patch("/:id", updatePanicStatus);

export default router;
