import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { parseMarkdownFile } from "./utils/markdown";
import { isPublished, updatePostState } from "./utils/state";
import { logger } from "./utils/logger";
import { PublisherAdapter } from "./types";

// Import Adapters
import { DevToAdapter } from "./adapters/devto";
import { HashnodeAdapter } from "./adapters/hashnode";
import { MediumAdapter } from "./adapters/medium";
import { WordPressAdapter } from "./adapters/wordpress";
import { GhostAdapter } from "./adapters/ghost";
import { HubSpotAdapter } from "./adapters/hubspot";
import { ShowwcaseAdapter } from "./adapters/showwcase";
import { BloggerAdapter } from "./adapters/blogger";
import { TumblrAdapter } from "./adapters/tumblr";
import { WixAdapter } from "./adapters/wix";
import { TelegraphAdapter } from "./adapters/telegraph";
import { MastodonAdapter } from "./adapters/mastodon";
import { NotionAdapter } from "./adapters/notion";
import { StrapiAdapter } from "./adapters/strapi";
import { LinkedInAdapter } from "./adapters/linkedin";
import { RedditAdapter } from "./adapters/reddit";
import { DiscordAdapter } from "./adapters/discord";

dotenv.config();

const POSTS_DIR = path.resolve(process.cwd(), "content/posts");

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes("--dry-run");

    logger.info("Starting Omni-Publisher Engine", { dryRun });

    // Initialize Adapters
    const adapters: PublisherAdapter[] = [
        new DevToAdapter(),
        new HashnodeAdapter(),
        new MediumAdapter(),
        new WordPressAdapter(),
        new GhostAdapter(),
        new HubSpotAdapter(),
        new ShowwcaseAdapter(),
        new BloggerAdapter(),
        new TumblrAdapter(),
        new WixAdapter(),
        new TelegraphAdapter(),
        new MastodonAdapter(),
        new NotionAdapter(),
        new StrapiAdapter(),
        new LinkedInAdapter(),
        new RedditAdapter(),
        new DiscordAdapter(),
    ];

    const enabledAdapters = adapters.filter((a) => a.enabled);
    logger.info(
        `Enabled Adapters: ${enabledAdapters.map((a) => a.name).join(", ")}`
    );

    if (enabledAdapters.length === 0 && !dryRun) {
        logger.warn("No adapters enabled. Check your .env file.");
        return;
    }

    // Read Posts
    let files: string[] = [];
    try {
        files = await fs.readdir(POSTS_DIR);
    } catch (error) {
        logger.error(`Could not read posts directory: ${POSTS_DIR}`);
        return;
    }

    const posts = files.filter((f) => f.endsWith(".md"));
    logger.info(`Found ${posts.length} posts.`);

    for (const file of posts) {
        const filePath = path.join(POSTS_DIR, file);
        const post = await parseMarkdownFile(filePath);

        logger.info(
            `Processing post: ${post.frontmatter.title} (${post.slug})`
        );

        const publishPromises = enabledAdapters.map(async (adapter) => {
            // Check idempotency
            if (await isPublished(post.slug, adapter.name)) {
                logger.info(
                    `Skipping ${adapter.name} for ${post.slug} (Already Published)`
                );
                return;
            }

            if (dryRun) {
                logger.info(`[DRY RUN] Would publish to ${adapter.name}`);
                return;
            }

            // Publish
            logger.info(`Publishing to ${adapter.name}...`);
            const result = await adapter.publish(post);

            if (result.success && result.url && result.postId) {
                await updatePostState(
                    post.slug,
                    adapter.name,
                    result.url,
                    result.postId
                );
                logger.info(
                    `Successfully published to ${adapter.name}: ${result.url}`
                );
            } else {
                logger.error(
                    `Failed to publish to ${adapter.name}: ${result.error}`
                );
            }
        });

        // Concurrency: Process all platforms for a single post in parallel
        // We process posts sequentially to avoid overwhelming local resources,
        // but platforms in parallel.
        await Promise.allSettled(publishPromises);
    }

    logger.info("Omni-Publisher Run Complete.");
}

main().catch((error) => {
    logger.error("Fatal Error in Main Loop", { error });
    process.exit(1);
});
