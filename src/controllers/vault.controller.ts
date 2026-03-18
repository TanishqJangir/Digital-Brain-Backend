import { Request, Response } from 'express';
import { Vault } from '../models/Vault.model';
import { TokenPayload } from '../utils/jwt';
import { Tag } from '../models/Tag.model';
// import { fetchMetadata } from '../utils/fetchMetadata';



export const createContentController = async (req: Request, res: Response): Promise<any> => {
    const { title, url, type, customType, tags, description } = req.body;

    if (!title || !url || !type) {
        return res.status(400).json({
            message: "Title, Url and Type is required.",
        });
    };

    try {
        const userId = (req.user as TokenPayload).userId;

        const existingContent = await Vault.findOne({
            url,
            userId
        });

        if (existingContent) {
            return res.status(400).json({
                message: "Content with the same url already exist."
            });
        };

        const normalizedTags = tags?.map((tag: string) => tag.trim().toLowerCase());

        await Vault.create({
            title,
            description,
            type,
            url,
            customType,
            tags: normalizedTags,
            userId,
        });

        return res.status(201).json({
            message: "Content created successfully"
        });

    } catch (error) {
        console.error("Error while creating content: ", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    };
};


export const getContentsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req.user as TokenPayload).userId;

        const contents = await Vault.find({userId}).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Contents fetched successfully.",
            contents
        });

    } catch (error) {
        console.error("Error while fetching contents: ", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    };
};


export const deleteContentController = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Content id is required."
        });
    };

    try {
        const userId = (req.user as TokenPayload).userId;
        const content = await Vault.findOne({
            _id: id,
            userId
        });

        if (!content) {
            return res.status(404).json({
                message: "Content not found."
            });
        };

        await content.deleteOne();

        for (const tagName of content.tags) {
            const stillUsed = await Vault.findOne({
                userId: userId,
                tags: tagName,
                _id: { $ne: id }
            });

            if (!stillUsed) {
                await Tag.deleteOne({ tag: tagName, userId: userId });
            };
        };

        return res.status(200).json({
            message: "Content deleted successfully."
        });

    } catch (error) {
        console.error("Error while deleting the content: ", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    };
};


export const updateContentController = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, description, tags, type, customType, url } = req.body;

    if (!title || !url || !type) {
        return res.status(400).json({
            message: "Title, Url and Type is required."
        });
    }

    if (!id) {
        return res.status(400).json({
            message: "Content Id is required."
        });
    };

    try {
        const userId = (req.user as TokenPayload).userId;
        const content = await Vault.findOneAndUpdate({
            _id: id,
            userId
        }, {
            $set: {
                title,
                description,
                tags,
                type,
                customType,
                url,
            },
        }, {
            returnDocument: "after",
        }
        );

        if (!content) {
            return res.status(404).json({
                message: "Content not found."
            });
        };


        return res.status(200).json({
            message: "Content updated successfully.",
            content
        });
    } catch (error) {
        console.error("Error while updating the content: ", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    };
};


// export const generateMetadataController = async (req: Request, res: Response) : Promise<any> => {
//     const { url, type, customType } = req.body;

//     if(!url || !type){
//         return res.status(400).json({
//             message : "Url, Type and Custom Type are required."
//         });
//     };

//     try{
//         const result = await fetchMetadata({url, type, customType});

//         if(!result){
//             return res.status(500).json({
//                 message : "Failed to generate metadata."
//             });
//         }

//         return res.status(200).json({
//             message : "Metadata generated successfully.",
//             data : result
//         });


//     }catch(error){
//         console.error("Error while generating metadata: ", error);
//         return res.status(500).json({
//             message: "Internal Server Error."
//         });
//     };
// };