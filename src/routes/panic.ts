import express from "express";
import {
  createPanicRequest,
  getPanicRequests,
  getPanicById,
  updatePanicStatus,
} from "../controllers/panicController";

const router = express.Router();

router.post("/", createPanicRequest);
router.get("/", getPanicRequests);
router.get("/:id", getPanicById);
router.patch("/:id", updatePanicStatus);

export default router;
