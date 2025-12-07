import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value.toLowerCase();

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.findOne({ email });
        }

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos[0]?.value;
            await user.save();
          }
          return cb(null, user);
        }

        user = await User.create({
          googleId: profile.id,
          provider: "google",
          email,
          fullname: profile.displayName,
          avatar: profile.photos[0]?.value || null,
          emailVerified: true, // Google emails are verified
          termsAccepted: false, // Will be set on role selection
        });

        return cb(null, user);
      } catch (err) {
        console.error("Google Strategy Error:", err);
        return cb(err);
      }
    }
  )
);

