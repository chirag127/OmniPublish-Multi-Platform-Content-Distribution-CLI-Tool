import { Client } from "@notionhq/client";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class NotionAdapter implements PublisherAdapter {
    name = "Notion";
    enabled = !!(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
    notion: Client | null = null;

    constructor() {
        if (this.enabled) {
            this.notion = new Client({ auth: process.env.NOTION_API_KEY });
        }
    }

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled || !this.notion) {
            return {
                platform: this.name,
                success: false,
                error: "Credentials missing",
            };
        }

        try {
            const response = await this.notion.pages.create({
                parent: { database_id: process.env.NOTION_DATABASE_ID! },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: post.frontmatter.title,
                                },
                            },
                        ],
                    },
                    Tags: {
                        multi_select: (post.frontmatter.tags || []).map(
                            (tag) => ({ name: tag })
                        ),
                    },
                },
                children: [
                    {
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: {
                                        content: post.content.substring(
                                            0,
                                            2000
                                        ), // Notion block limit
                                    },
                                },
                            ],
                        },
                    },
                ],
            });

            const url = (response as any).url;
            logPublishResult(this.name, post.slug, true, undefined, url);
            return {
                platform: this.name,
                success: true,
                url,
                postId: response.id,
            };
        } catch (error: any) {
            const msg = error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
