import type { Request, Response } from "express";
import { db } from "../db/db.ts";
import { shows, users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { asc } from "drizzle-orm";

export const createShow = async (req: Request, res: Response) => {
    try {
        const { userId, title, description, eventDate } = req.body;

        // 1. Validate input
        if (!userId || !title || !eventDate) {
            return res.status(400).json({ error: "Please provide hostId, title, and eventDate." });
        }

        // 2. Use a transaction to ensure both operations succeed or fail together
        const newShow = await db.transaction(async (tx) => {
            
            // a. Insert the new show into the database
            const [show] = await tx.insert(shows)
                .values({
                    hostId: userId,
                    title,
                    description,
                    eventDate: new Date(eventDate),
                })
                .returning();

            // b. Update the user's role to 'host'
            // This safely upgrades an 'attendant' to a 'host' upon creating their first show.
            await tx.update(users)
                .set({ role: 'host' })
                .where(eq(users.id, userId));

            return show;
        });

        // 3. Send success response
        return res.status(201).json({ 
            message: "Show created successfully. You are now a host!", 
            show: newShow 
        });

    } catch (error: any) {
        console.error('Error creating show:', error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const getAllShows = async (req: Request, res: Response) => {
    try {
        // Query the database for all shows.
        // We can optionally sort them by eventDate so the soonest shows appear first.
        const allShows = await db.select()
            .from(shows)
            .orderBy(asc(shows.eventDate)); 

        return res.status(200).json({ 
            message: "Shows retrieved successfully.", 
            shows: allShows 
        });

    } catch (error: any) {
        console.error('Error fetching shows:', error);
        return res.status(500).json({ error: "Internal server error." });
    }
};