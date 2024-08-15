import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from 'dotenv';
import { db } from "../config/db";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    passReqToCallback: true,
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        const rawProfile = JSON.parse(profile._raw);
        const { sub: googleId, name, email } = profile._json;

        if (!name || !email) {
            return done(new Error("Missing required fields: name or email"));
        }

        const newUser = {
            googleId,
            name,
            email,
            picture: rawProfile.picture || '',
            provider: profile.provider,
        };

        // Check if user already exists
        let user = await db.user.findUnique({
            where: { googleId: newUser.googleId }
        });

        // If user doesn't exist, create a new one
        if (!user) {
            user = await db.user.create({
                data: newUser,
            });
        }

        return done(null, user);
    } catch (error) {
        console.error('Error during authentication', error);
        return done(error);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id); 
})

passport.deserializeUser(async(id: string, done) => {
    try {
        const user = await db.user.findUnique({
            where: { id }
        })
        if (user) {
            done(null, user);
        } else done(null, false)
    } catch (error) {
        console.error('Erro during deserialization', error)    
        done(error)
    }
});
