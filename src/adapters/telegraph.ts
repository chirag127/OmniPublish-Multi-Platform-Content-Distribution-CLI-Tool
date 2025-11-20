import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class TelegraphAdapter implements PublisherAdapter {
    name = "Telegraph";
    enabled = !!process.env.TELEGRAPH_ACCESS_TOKEN;

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "Access Token missing",
            };
        }

        try {
            // Telegraph requires a specific Node structure for content.
            // For simplicity, we will just post the title and a link to the main site or raw text.
            // A real implementation would parse HTML to Telegraph Nodes.

            const response = await axios.post(
                "https://api.telegra.ph/createPage",
                {
                    access_token: process.env.TELEGRAPH_ACCESS_TOKEN,
                    title: post.frontmatter.title,
                    author_name: post.frontmatter.author || "Omni-Publisher",
                    content: JSON.stringify([
                        {
                            tag: "p",
                            children: [post.content.substring(0, 2000)],
                        }, // Truncated for safety in this MVP
                    ]),
                    return_content: true,
                }
            );

            if (!response.data.ok) {
                throw new Error(response.data.error);
            }

            const url = response.data.result.url;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: response.data.result.path,
            };
        } catch (error: any) {
            const msg = error.response?.data?.error || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
