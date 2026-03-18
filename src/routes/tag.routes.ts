import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
    createTagController,
    deleteTagController,
    getTagsController,
} from "../controllers/tag.controller";

const router = express.Router();

router.post("/", requireAuth, createTagController);
router.delete("/:id", requireAuth, deleteTagController);
router.get("/", requireAuth, getTagsController);

export default router;