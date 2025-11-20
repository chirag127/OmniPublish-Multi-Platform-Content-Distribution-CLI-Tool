import snoowrap from "snoowrap";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class RedditAdapter implements PublisherAdapter {
    name = "Reddit";
    enabled = !!(
        process.env.REDDIT_CLIENT_ID &&
        process.env.REDDIT_CLIENT_SECRET &&
        process.env.REDDIT_USERNAME &&
        process.env.REDDIT_PASSWORD
    );
    r: any = null;

    constructor() {
        if (this.enabled) {
            this.r = new snoowrap({
                userAgent:
                    process.env.REDDIT_USER_AGENT || "OmniPublisher/1.0.0",
                clientId: process.env.REDDIT_CLIENT_ID,
                clientSecret: process.env.REDDIT_CLIENT_SECRET,
                username: process.env.REDDIT_USERNAME,
                password: process.env.REDDIT_PASSWORD,
            });
        }
    }

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled || !this.r) {
            return {
                platform: this.name,
                success: false,
                error: "Credentials missing",
            };
        }

        try {
            // Post to user's own profile (u/username)
            const subredditName = `u_${process.env.REDDIT_USERNAME}`;
            const submission = (await this.r
                .getSubreddit(subredditName)
                .submitSelfpost({
                    title: post.frontmatter.title,
                    text: `${post.frontmatter.description}\n\nRead more: [Link to your site]`,
                    subredditName: subredditName,
                })) as any;

            const url = `https://www.reddit.com${submission.permalink}`;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: submission.id,
            };
        } catch (error: any) {
            const msg = error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
