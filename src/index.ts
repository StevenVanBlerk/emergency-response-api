import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import panicRoutes from "./routes/panic";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/panic", panicRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
