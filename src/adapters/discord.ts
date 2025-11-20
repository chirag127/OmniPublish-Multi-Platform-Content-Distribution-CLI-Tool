import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class DiscordAdapter implements PublisherAdapter {
    name = "Discord";
    enabled = !!process.env.DISCORD_WEBHOOK_URL;

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "Webhook URL missing",
            };
        }

        try {
            await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
                content: `**New Post Published!** 🚀\n\n**${post.frontmatter.title}**\n${post.frontmatter.description}\n\nRead here: [Link]`,
                username: "Omni-Bot",
            });

            logPublishResult(
                this.name,
                post.slug,
                true,
                undefined,
                "Webhook Sent"
            );
            return {
                platform: this.name,
                success: true,
                url: "Webhook Sent",
                postId: "webhook",
            };
        } catch (error: any) {
            const msg = error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
