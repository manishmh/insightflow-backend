import { Request, Response, Router } from "express";
import User from "../models/user";
import { findUserByEmail } from "../utils/findUser";
import { registerSchema } from "../schemas/input-validation-schemas";
import { checkUniqueUsername } from "../middleware/check-unique-user";
import bcrypt from 'bcryptjs'

const RegisterRouter = Router();

RegisterRouter.post('/', checkUniqueUsername, async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const validatedFields = registerSchema.safeParse(req.body) 

        if (!validatedFields.success) {
            return res.status(400).json({error: "Invalid input fields."})
        }

        const ExistingUser = await findUserByEmail(email); 
        if (ExistingUser) {
            return res.status(401).json({ error: "Email already registered."})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({success: "User registered successfully."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Something went wrong! try again."}) 
    }
});

export default RegisterRouter;