import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class WordPressAdapter implements PublisherAdapter {
    name = "WordPress";
    enabled = !!(
        process.env.WORDPRESS_URL &&
        process.env.WORDPRESS_APP_PASSWORD &&
        process.env.WORDPRESS_USERNAME
    );

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "Credentials missing",
            };
        }

        try {
            const auth = Buffer.from(
                `${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`
            ).toString("base64");

            // WordPress REST API requires HTML content usually, but we'll send rendered HTML
            const content = post.html || post.content;

            const response = await axios.post(
                `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`,
                {
                    title: post.frontmatter.title,
                    content: content,
                    status: "publish",
                    slug: post.slug,
                },
                {
                    headers: {
                        Authorization: `Basic ${auth}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;
            logPublishResult(this.name, post.slug, true, undefined, data.link);
            return {
                platform: this.name,
                success: true,
                url: data.link,
                postId: data.id.toString(),
            };
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
