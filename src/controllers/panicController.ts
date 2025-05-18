import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../db";

const panicSchema = z.object({
  deviceId: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  timestamp: z.string().optional(), // ISO timestamp
});

export const handlePanic = async (req: Request, res: Response) => {
  const result = panicSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }

  const { deviceId, severity, location, timestamp } = result.data;

  try {
    const panicEvent = await prisma.panicEvent.create({
      data: {
        deviceId,
        severity,
        lat: location.lat,
        lng: location.lng,
        timestamp: timestamp ? new Date(timestamp) : undefined,
      },
    });

    return res
      .status(201)
      .json({ message: "Panic received", data: panicEvent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
