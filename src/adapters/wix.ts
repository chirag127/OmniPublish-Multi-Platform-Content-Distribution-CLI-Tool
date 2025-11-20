import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class WixAdapter implements PublisherAdapter {
    name = "Wix";
    enabled = !!(process.env.WIX_API_KEY && process.env.WIX_SITE_ID);

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "API Key or Site ID missing",
            };
        }

        try {
            // Using Wix Headless API for Blog
            // Endpoint structure assumes standard Wix Headless setup
            const response = await axios.post(
                "https://www.wixapis.com/blog/v3/posts",
                {
                    post: {
                        title: post.frontmatter.title,
                        richContent: {
                            // Wix uses complex rich content structure, sending simplified version or HTML if supported
                            nodes: [
                                {
                                    type: "PARAGRAPH",
                                    id: "foo",
                                    nodes: [
                                        {
                                            type: "TEXT",
                                            id: "bar",
                                            nodes: [],
                                            textData: {
                                                text:
                                                    post.content.substring(
                                                        0,
                                                        500
                                                    ) +
                                                    "... (See full post on other platforms)", // Simplified for MVP
                                                decorations: [],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        slug: post.slug,
                    },
                    publish: true,
                },
                {
                    headers: {
                        Authorization: process.env.WIX_API_KEY,
                        "wix-site-id": process.env.WIX_SITE_ID,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data.post;
            // Construct URL manually as API might return internal ID
            const url = `https://your-wix-site.com/blog/${data.slug}`;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return { platform: this.name, success: true, url, postId: data.id };
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
