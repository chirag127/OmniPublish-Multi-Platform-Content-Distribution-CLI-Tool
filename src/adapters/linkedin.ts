import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class LinkedInAdapter implements PublisherAdapter {
    name = "LinkedIn";
    enabled = !!(
        process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN
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
            const response = await axios.post(
                "https://api.linkedin.com/v2/ugcPosts",
                {
                    author: process.env.LINKEDIN_PERSON_URN,
                    lifecycleState: "PUBLISHED",
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": {
                            shareCommentary: {
                                text: `${post.frontmatter.title}\n\n${
                                    post.frontmatter.description || ""
                                }\n\n#${(post.frontmatter.tags || []).join(
                                    " #"
                                )}`,
                            },
                            shareMediaCategory: "NONE",
                        },
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const id = response.data.id;
            const url = `https://www.linkedin.com/feed/update/${id}`;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return { platform: this.name, success: true, url, postId: id };
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
