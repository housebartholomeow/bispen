import type { Request, Response} from "express"
import { users } from "../db/schema.ts"
import bcrypt from "bcrypt"
import { db } from "../db/db.ts"
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, password, email } = req.body;

        // 1. Validate input
        if (!name || !password || !email) {
            return res.status(400).json({ error: "Please fill in all fields." });
        }

        // 2. Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Insert into the database using Drizzle
        const [newUser] = await db.insert(users)
            .values({
                name,
                email,
                password: hashedPassword, // Store the hash, NOT the raw password
                // Note: 'role' is omitted so it safely falls back to your 'user' default
            })
            .returning({
                // Explicitly return only safe data to the client
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            });

        // 4. Send success response
        return res.status(201).json({ 
            message: "User created successfully.", 
            user: newUser 
        });

    } catch (error: any) {
        // 5. Handle Postgres unique constraint violation for emails
        if (error.code === '23505') {
            return res.status(409).json({ error: "A user with this email already exists." });
        }

        // 6. Handle general server errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password." });
        }

        // 2. Find the user by email
        // Drizzle returns an array, so we grab the first item (if it exists)
        const [user] = await db.select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user) {
            // Security Best Practice: Use a generic error message
            // so attackers don't know which part (email or password) was wrong.
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // 3. Compare the provided password with the hashed password in the DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // 4. Generate a JWT token
        // In your .env file, add: JWT_SECRET="some_super_secret_string"
        const token = jwt.sign(
            { 
                userId: user.id, 
                role: user.role 
            }, 
            process.env.JWT_SECRET || 'fallback_development_secret', 
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 5. Strip the password before sending the user data back to the client
        const { password: _, ...safeUserData } = user;

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: safeUserData
        });

    } catch (error: any) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: "Internal server error." });
    }
}