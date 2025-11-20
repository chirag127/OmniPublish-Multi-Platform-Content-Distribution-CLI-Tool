import axios from "axios";
import { BlogPost, PublishResult, PublisherAdapter } from "../types";
import { logPublishResult } from "../utils/logger";

export class HashnodeAdapter implements PublisherAdapter {
    name = "Hashnode";
    enabled = !!(
        process.env.HASHNODE_PAT && process.env.HASHNODE_PUBLICATION_ID
    );

    async publish(post: BlogPost): Promise<PublishResult> {
        if (!this.enabled) {
            return {
                platform: this.name,
                success: false,
                error: "API Key or Publication ID missing",
            };
        }

        const query = `
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post {
            id
            url
          }
        }
      }
    `;

        const variables = {
            input: {
                title: post.frontmatter.title,
                contentMarkdown: post.content,
                publicationId: process.env.HASHNODE_PUBLICATION_ID,
                tags: [], // Hashnode requires tag objects, skipping for simplicity or need mapping
                slug: post.slug,
            },
        };

        try {
            const response = await axios.post(
                "https://gql.hashnode.com",
                { query, variables },
                {
                    headers: {
                        Authorization: process.env.HASHNODE_PAT,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const data = response.data.data.publishPost.post;
            logPublishResult(this.name, post.slug, true, undefined, data.url);
            return {
                platform: this.name,
                success: true,
                url: data.url,
                postId: data.id,
            };
        } catch (error: any) {
            const msg =
                error.response?.data?.errors?.[0]?.message || error.message;
            logPublishResult(this.name, post.slug, false, msg);
            return { platform: this.name, success: false, error: msg };
        }
    }
}
