import { Request, Response } from 'express';
import { TokenPayload } from '../utils/jwt';
import { Tag } from '../models/Tag.model';
import { Vault } from '../models/Vault.model';


export const createTagController = async (req: Request, res: Response): Promise<any> => {
    const { tag } = req.body;

    if (!tag) {
        return res.status(400).json({
            message: "Tag is required.",
        });
    };

    try {
        const userId = (req.user as TokenPayload).userId;
        const existingTags = await Tag.find({
            userId: userId,
            tag: tag
        });

        if (existingTags) {
            return res.status(400).json({
                message: "Tag with the same name already exists.",
            });
        };

        const newTag = await Tag.create({
            userId: userId,
            tag: tag
        });

        return res.status(200).json({
            message: "Tag created successfully.",
            tag: newTag
        })


    } catch (error: any) {
        console.error("Error while creating Tags: ", error);
        return res.status(500).json({
            message: "Internal Server Error.",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    };
};


export const getTagsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req.user as TokenPayload).userId;

        const tags = await Tag.find({
            userId
        }).sort({ createdAt: -1 });

        if (!tags) {
            return res.status(400).json({
                message: "No tags found."
            });
        };

        return res.status(200).json({
            message: "Tags retrieved successfully.",
            tags: tags
        });

    } catch (error) {
        console.error("Error while fetching the tags: ", error);
        return res.status(500).json({
            message: "Internal server Error.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    };
};


export const deleteTagController = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Tag id is required.",
        });
    };

    try {
        const userId = (req.user as TokenPayload).userId;
        const tag = await Tag.findOne({
            _id: id,
            userId: userId,
        });

        if (!tag) {
            return res.status(400).json({
                message: "Tag not found."
            });
        };

        await tag.deleteOne();

        await Vault.updateMany(
            { userId: userId, tags: tag.tag },
            { $pull: { tags: tag.tag } }
        );

        return res.status(200).json({
            message: "Tag deleted successfully."
        })

    } catch (error) {
        console.error("Error occured while deleting the tag: ", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    };
};