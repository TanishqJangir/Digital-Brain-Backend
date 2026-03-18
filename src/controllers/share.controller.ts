import { Request, Response } from 'express';
import { TokenPayload } from '../utils/jwt';
import { User } from '../models/User.model';
import { Vault } from '../models/Vault.model';
import crypto from 'crypto';


export const createShareLinkController = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req.user as TokenPayload).userId;

        const shareHash = crypto.randomBytes(12).toString("hex"); // 24 char random string
        const shareLinkExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                shareLink: shareHash,
                shareLinkExpiry: shareLinkExpiry,
            },
        }, {
            returnDocument: "after",
        });

        if (!user) {
            return res.status(400).json({
                message: "User does not exist.",
            });
        };

        return res.status(200).json({
            message: "Share link created successfully.",
            shareLink: shareHash,
        });

    } catch (error) {
        console.error("Error while creating share link: ", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    };
};

export const getSharedLinkController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { shareLink } = req.params;

        if (!shareLink) {
            return res.status(400).json({
                message: "Share link is required.",
            });
        };

        const user = await User.findOne({
            shareLink: shareLink,
            shareLinkExpiry: { $gt: new Date() }
        }).select("name avatar _id");

        if (!user) {
            return res.status(404).json({
                message: "Share link not found or expired",
            });
        };

        const contents = await Vault.find({ userId: user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Content fetched successfully.",
            name: user.name,
            avatar: user.avatar,
            contents
        });

    } catch (error) {
        console.error("Error while fething the contents from the share link: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    };
};