import express from "express";
import 'dotenv/config';
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import passport from "./config/passport";
import vaultRoutes from "./routes/vault.routes";
import tagRoutes from "./routes/tag.routes";
import shareRoutes from "./routes/share.routes";
import { env } from "./config/env";

const app = express();

const port = env.PORT;

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vault", vaultRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/share", shareRoutes);


app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
