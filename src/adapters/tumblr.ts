const tumblr = require("tumblr.js");
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class TumblrAdapter implements PublisherAdapter {
    name = "Tumblr";
    enabled = !!(
        process.env.TUMBLR_CONSUMER_KEY &&
        process.env.TUMBLR_CONSUMER_SECRET &&
        process.env.TUMBLR_TOKEN &&
        process.env.TUMBLR_TOKEN_SECRET &&
        process.env.TUMBLR_BLOG_IDENTIFIER
    );
    client: any;

    constructor() {
        if (this.enabled) {
            this.client = tumblr.createClient({
                consumer_key: process.env.TUMBLR_CONSUMER_KEY,
                consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
                token: process.env.TUMBLR_TOKEN,
                token_secret: process.env.TUMBLR_TOKEN_SECRET,
            });
        }
    }

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "OAuth Credentials missing",
            };
        }

        return new Promise((resolve) => {
            this.client.createTextPost(
                process.env.TUMBLR_BLOG_IDENTIFIER,
                {
                    title: post.frontmatter.title,
                    body: post.content,
                    tags: (post.frontmatter.tags || []).join(","),
                },
                (err: any, data: any) => {
                    if (err) {
                        const msg = err.message || "Unknown error";
                        logPublishResult(this.name, post.slug, false, msg);
                        resolve({
                            platform: this.name,
                            success: false,
                            error: msg,
                        });
                    } else {
                        const url = `https://${process.env.TUMBLR_BLOG_IDENTIFIER}/post/${data.id}`;
                        logPublishResult(
                            this.name,
                            post.slug,
                            true,
                            undefined,
                            url
                        );
                        resolve({
                            platform: this.name,
                            success: true,
                            url,
                            postId: data.id,
                        });
                    }
                }
            );
        });
    }
}
