// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { env } from "../config/env";
// import ogs from 'open-graph-scraper';
// import axios from "axios";


// export const fetchMetadata = async ({ url, type, customType }: { url: string, type: string, customType?: string }) => {

//     let title = "";
//     let description = "";
//     try {
//         if (type === "youtube") {
//             const ytResponse = await axios.get(`https://www.youtube.com/oembed?url=${url}&format=json`);

//             title = ytResponse.data.title;
//             description = `A youtube video with title: ${title}`;

//         } else {
//             const { result } = await ogs({ url });
//             title = result.ogTitle || "Default Title";
//             description = result.ogDescription || "Default Description";

//         }

//     } catch (error) {
//         console.error("Metadata extraction failed: ", error);
//     }


//     let aiData = {
//         title,
//         description,
//         tags: [] as string[]
//     }


//     const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

//     const model = genAI.getGenerativeModel({
//         model: "gemini-2.5-flash",
//     });

//     const prompt = `
// Given the following:
// URL : ${url};
// Type : ${type};
// Custom Type : ${customType};
// fetch and analyse the content from the url from its source(type) and if the type is "other", use the custom type
// and if the url is not accessible or the content cannot be fetched, then generate a title, description and tags just based on the url telling invalid or not accessible url, type and custom type.
// and the tags should not contain space between words and should be relevant to the content.
// Generate: 
// - A clean title (max 50 char)
// - A short description (max 150 char )
// - 3 to 5 relavent tags

// Return Only Json like:
// {
//     title : "",
//     description : "",
//     tags : ["", ""]
// }
// `
//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     const jsonStart = responseText.indexOf("{");
//     const jsonEnd = responseText.lastIndexOf("}");

//     const jsonString = responseText.slice(jsonStart, jsonEnd + 1);

//     const parsed = JSON.parse(jsonString);

//     aiData = {
//         title: parsed.title || "Ai generated title",
//         description: parsed.description || "Ai generated description",
//         tags: parsed.tags || ["Ai"]
//     }

//     return aiData;

// }