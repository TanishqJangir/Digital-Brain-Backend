import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/User.model";
import { env } from "./env";

// Google Strategy — find or create user
// passport.use(new GoogleStrategy({ clientID, clientSecret, callbackURL }, async (_, __, profile, done) => { ... }));

// GitHub Strategy — find or create user
// passport.use(new GitHubStrategy({ clientID, clientSecret, callbackURL, scope: ["user:email"] }, async (_, __, profile, done) => { ... }));


passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {

        try {

            let user = await User.findOne({ provider: "google", providerId: profile.id });

            if (!user) {
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    avatar: profile.photos?.[0]?.value,
                    password: "",
                    provider: "google",
                    providerId: profile.id,
                    isEmailVerified: true,
                })
            }

            return done(null, user);

        } catch (err) {
            return done(err as Error);
        }
    }
));

passport.use(new GitHubStrategy({
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/github/callback",
    scope: ["user:email"]
},
    async (accessToken: string, refreshToken: string, profile: any, done: Function) => {

        try {
            let user = await User.findOne({ provider: "github", providerId: profile.id });

            if (!user) {
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    avatar: profile.photos?.[0]?.value,
                    password: "",
                    provider: "github",
                    providerId: profile.id,
                    isEmailVerified: true,
                })
            }

            return done(null, user);

        } catch (err) {

            return done(err as Error);
        }
    }
));


export default passport;