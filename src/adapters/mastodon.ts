import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class MastodonAdapter implements PublisherAdapter {
    name = "Mastodon";
    enabled = !!(process.env.MASTODON_URL && process.env.MASTODON_ACCESS_TOKEN);

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "Credentials missing",
            };
        }

        try {
            const statusText = `${post.frontmatter.title}\n\n${
                post.frontmatter.description || ""
            }\n\n#${(post.frontmatter.tags || []).join(" #")}`;

            const response = await axios.post(
                `${process.env.MASTODON_URL}/api/v1/statuses`,
                {
                    status: statusText.substring(0, 500), // Mastodon limit
                    visibility: "public",
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const url = response.data.url;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: response.data.id,
            };
        } catch (error: any) {
            const msg = error.response?.data?.error || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
