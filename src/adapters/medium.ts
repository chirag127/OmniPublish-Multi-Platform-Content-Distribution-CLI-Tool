import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class MediumAdapter implements PublisherAdapter {
    name = "Medium";
    enabled = !!process.env.MEDIUM_INTEGRATION_TOKEN;

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "Integration Token missing",
            };
        }

        try {
            // 1. Get User ID if not provided
            let userId = process.env.MEDIUM_USER_ID;
            if (!userId) {
                const userResp = await axios.get(
                    "https://api.medium.com/v1/me",
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.MEDIUM_INTEGRATION_TOKEN}`,
                        },
                    }
                );
                userId = userResp.data.data.id;
            }

            // 2. Publish
            const response = await axios.post(
                `https://api.medium.com/v1/users/${userId}/posts`,
                {
                    title: post.frontmatter.title,
                    contentFormat: "markdown",
                    content: post.content,
                    tags: post.frontmatter.tags || [],
                    publishStatus: "public",
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.MEDIUM_INTEGRATION_TOKEN}`,
                    },
                }
            );

            const data = response.data.data;
            logPublishResult(this.name, post.slug, true, undefined, data.url);
            return {
                platform: this.name,
                success: true,
                url: data.url,
                postId: data.id,
            };
        } catch (error: any) {
            const msg =
                error.response?.data?.errors?.[0]?.message || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
