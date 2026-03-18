import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
    createShareLinkController,
    getSharedLinkController
} from "../controllers/share.controller";

const router = express.Router();

router.post("/create", requireAuth, createShareLinkController);
router.get("/:shareLink", getSharedLinkController);

export default router;