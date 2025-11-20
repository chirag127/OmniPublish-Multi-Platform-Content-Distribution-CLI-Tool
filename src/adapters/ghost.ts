import GhostAdminAPI from "@tryghost/admin-api";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class GhostAdapter implements PublisherAdapter {
    name = "Ghost";
    enabled = !!(process.env.GHOST_URL && process.env.GHOST_ADMIN_API_KEY);
    api: any;

    constructor() {
        if (this.enabled) {
            this.api = new GhostAdminAPI({
                url: process.env.GHOST_URL!,
                key: process.env.GHOST_ADMIN_API_KEY!,
                version: "v5.0",
            });
        }
    }

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "Credentials missing",
            };
        }

        try {
            // Ghost prefers HTML or Mobiledoc. We'll convert MD to HTML in utils or here.
            // Assuming post.html is populated by our markdown util.
            const response = await this.api.posts.add({
                title: post.frontmatter.title,
                html: post.html,
                status: "published",
                slug: post.slug,
                tags: post.frontmatter.tags
                    ? post.frontmatter.tags.map((t) => ({ name: t }))
                    : [],
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
