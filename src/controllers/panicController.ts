import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../db";
import { v4 as uuidv4 } from "uuid";

// TO-DO: create endpoint that integrates with 3rd party emergency services APIs to dispatch to the nearest available unit

// POST
export const createPanicRequest = async (req: Request, res: Response) => {
  const panicSchema = z.object({
    aidRequired: z.enum(["AMBULANCE", "SECURITY", "POLICE"]),
    serviceDisplayName: z.string(),
    timeOfRequest: z.string(),
    severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
      displayValue: z.string(),
    }),
    user: z.object({
      externalId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      contactNumber: z.string(),
      nextOfKinContactNumber: z.string(),
    }),
  });
  const result = panicSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }

  const {
    aidRequired,
    serviceDisplayName,
    timeOfRequest,
    severity,
    location,
    user,
  } = result.data;

  try {
    // Find existing user by externalId
    let dbUser = await prisma.user.findUnique({
      where: { externalId: user.externalId },
    });

    if (dbUser) {
      // Update user details
      dbUser = await prisma.user.update({
        where: { externalId: user.externalId },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber,
          nextOfKinContactNumber: user.nextOfKinContactNumber,
        },
      });
    } else {
      // Create new user with generated UUID
      dbUser = await prisma.user.create({
        data: {
          id: uuidv4(),
          externalId: user.externalId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber,
          nextOfKinContactNumber: user.nextOfKinContactNumber,
        },
      });
    }

    const panic = await prisma.panicEvent.create({
      data: {
        status: "OPEN", // All new panic requests are created as OPEN
        aidRequired,
        serviceDisplayName,
        timeOfRequest: new Date(timeOfRequest),
        severity,
        lat: location.lat,
        lng: location.lng,
        locationLabel: location.displayValue,
        userId: dbUser.id,
      },
    });

    return res.status(201).json({ message: "Panic created", data: panic });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create panic" });
  }
};

// GET
export const getPanicRequests = async (req: Request, res: Response) => {
  try {
    const panics = await prisma.panicEvent.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const formatted = panics.map((panic) => ({
      id: panic.id,
      status: panic.status,
      aidRequired: panic.aidRequired,
      serviceDisplayName: panic.serviceDisplayName,
      timeOfRequest: panic.timeOfRequest.toISOString(),
      severity: panic.severity,
      location: {
        lat: panic.lat,
        lng: panic.lng,
        displayValue: panic.locationLabel,
      },
      user: {
        id: panic.user.id,
        firstName: panic.user.firstName,
        lastName: panic.user.lastName,
        email: panic.user.email,
        contactNumber: panic.user.contactNumber,
        nextOfKinContactNumber: panic.user.nextOfKinContactNumber,
        externalId: panic.user.externalId,
      },
    }));

    return res.status(200).json({ data: formatted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch panic requests" });
  }
};

// GET /:id
export const getPanicById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const panic = await prisma.panicEvent.findUnique({
      where: { id },
    });

    if (!panic) {
      return res.status(404).json({ error: "Panic event not found" });
    }

    return res.status(200).json({ data: panic });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch panic event" });
  }
};

// PATCH /:id
export const updatePanicStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  const statusSchema = z.object({
    status: z.enum(["OPEN", "ACKNOWLEDGED", "DISPATCHED", "RESOLVED"]),
  });

  const result = statusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }

  try {
    const updated = await prisma.panicEvent.update({
      where: { id },
      data: { status: result.data.status },
    });

    return res.status(200).json({ message: "Status updated", data: updated });
  } catch (err: any) {
    if (err.code === "P2025") {
      // Prisma error for "record not found"
      return res.status(404).json({ error: "Panic event not found" });
    }

    console.error(err);
    return res.status(500).json({ error: "Failed to update panic status" });
  }
};
