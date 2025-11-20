import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class DevToAdapter implements PublisherAdapter {
    name = "Dev.to";
    enabled = !!process.env.DEVTO_API_KEY;

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "API Key missing",
            };
        }

        try {
            const response = await axios.post(
                "https://dev.to/api/articles",
                {
                    article: {
                        title: post.frontmatter.title,
                        body_markdown: post.content,
                        published: true,
                        tags: post.frontmatter.tags || [],
                        series: post.frontmatter.series,
                        description: post.frontmatter.description,
                    },
                },
                {
                    headers: {
                        "api-key": process.env.DEVTO_API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );

            const url = response.data.url;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: response.data.id.toString(),
            };
        } catch (error: any) {
            const msg = error.response?.data?.error || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
