import { google } from "googleapis";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class BloggerAdapter implements PublisherAdapter {
    name = "Blogger";
    enabled = !!(
        process.env.BLOGGER_CLIENT_ID &&
        process.env.BLOGGER_CLIENT_SECRET &&
        process.env.BLOGGER_REFRESH_TOKEN &&
        process.env.BLOGGER_BLOG_ID
    );

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "OAuth Credentials missing",
            };
        }

        try {
            const oauth2Client = new google.auth.OAuth2(
                process.env.BLOGGER_CLIENT_ID,
                process.env.BLOGGER_CLIENT_SECRET
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.BLOGGER_REFRESH_TOKEN,
            });

            const blogger = google.blogger({
                version: "v3",
                auth: oauth2Client,
            });

            const res = await blogger.posts.insert({
                blogId: process.env.BLOGGER_BLOG_ID,
                requestBody: {
                    title: post.frontmatter.title,
                    content: post.html || post.content,
                },
            });

            const url = res.data.url || "";
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: res.data.id || "",
            };
        } catch (error: any) {
            const msg = error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
