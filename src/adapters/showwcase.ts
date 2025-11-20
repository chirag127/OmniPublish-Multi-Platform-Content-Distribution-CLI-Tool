import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class ShowwcaseAdapter implements PublisherAdapter {
    name = "Showwcase";
    enabled = !!process.env.SHOWWCASE_API_KEY;

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "API Key missing",
            };
        }

        try {
            // Based on standard REST patterns for Showwcase (Threads/Articles)
            // Endpoint is hypothetical based on research, will need validation.
            const response = await axios.post(
                "https://cache.showwcase.com/threads",
                {
                    title: post.frontmatter.title,
                    message: post.content, // Threads usually take a message body
                },
                {
                    headers: {
                        "x-api-key": process.env.SHOWWCASE_API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );

            const url = `https://showwcase.com/thread/${response.data.id}`;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: response.data.id,
            };
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
