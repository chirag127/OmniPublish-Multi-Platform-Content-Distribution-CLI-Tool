import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class StrapiAdapter implements PublisherAdapter {
    name = "Strapi";
    enabled = !!(process.env.STRAPI_URL && process.env.STRAPI_API_TOKEN);

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "Credentials missing",
            };
        }

        try {
            // Assumes a 'Article' collection type with title, content, slug fields
            const response = await axios.post(
                `${process.env.STRAPI_URL}/api/articles`,
                {
                    data: {
                        title: post.frontmatter.title,
                        content: post.content,
                        slug: post.slug,
                        publishedAt: new Date().toISOString(),
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const id = response.data.data.id;
            const url = `${process.env.STRAPI_URL}/articles/${post.slug}`; // Hypothetical frontend URL
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: id.toString(),
            };
        } catch (error: any) {
            const msg = error.response?.data?.error?.message || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
