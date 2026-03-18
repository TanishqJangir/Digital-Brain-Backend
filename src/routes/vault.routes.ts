import express from "express";
import {
    createContentController,
    updateContentController,
    deleteContentController,
    getContentsController,
    // generateMetadataController
} from "../controllers/vault.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { createVaultSchema } from "../validators/vault.validator"
import { validate } from "../middlewares/validate.middleware";
const router = express.Router();

router.post("/", requireAuth, validate(createVaultSchema), createContentController);
// router.post("/auto", requireAuth, generateMetadataController);
router.get("/", requireAuth, getContentsController);
router.put("/:id", requireAuth, updateContentController);
router.delete("/:id", requireAuth, deleteContentController);


export default router;