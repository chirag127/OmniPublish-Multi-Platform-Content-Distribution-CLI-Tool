import { Client } from "@hubspot/api-client";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class HubSpotAdapter implements PublisherAdapter {
    name = "HubSpot";
    enabled = !!process.env.HUBSPOT_ACCESS_TOKEN;
    client: Client | null = null;

    constructor() {
        if (this.enabled) {
            this.client = new Client({
                accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
            });
        }
    }

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled || !this.client) {
            return {
                platform: this.name,
                success: false,
                error: "Access Token missing",
            };
        }

        try {
            // HubSpot CMS Blog Post API
            // Note: This requires a CMS Hub subscription (Free tier has limits/availability varies)
            // We assume the user has access.

            const client = this.client as any;
            const response =
                await client.cms.blogs.blogPosts.blogPostsApi.create({
                    name: post.frontmatter.title,
                    postBody: post.html || post.content,
                    contentGroupId: "YOUR_DEFAULT_BLOG_ID", // Ideally fetched or env var
                    slug: post.slug,
                    metaDescription: post.frontmatter.description,
                    state: "PUBLISHED",
                });

            logPublishResult(
                this.name,
                post.slug,
                true,
                undefined,
                response.url
            );
            return {
                platform: this.name,
                success: true,
                url: response.url,
                postId: response.id,
            };
        } catch (error: any) {
            const msg = error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
