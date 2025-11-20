import fs from "fs/promises";
import path from "path";
import seedPosts from "./data/seed_posts.json";
import { logger } from "./utils/logger";

const POSTS_DIR = path.resolve(process.cwd(), "content/posts");

async function seedContent() {
    try {
        // Ensure directory exists
        await fs.mkdir(POSTS_DIR, { recursive: true });

        for (const post of seedPosts) {
            const fileName = `${post.slug}.md`;
            const filePath = path.join(POSTS_DIR, fileName);

            // Check if file exists to avoid overwriting manual edits if run multiple times
            // But for this task, we can overwrite or skip. Let's skip if exists.
            try {
                await fs.access(filePath);
                logger.info(`Skipping existing post: ${fileName}`);
                continue;
            } catch {
                // File doesn't exist, create it
            }

            const frontmatter = `---
title: "${post.title}"
description: "${post.body.substring(0, 150)}..."
date: "2025-11-20"
tags: ${JSON.stringify(post.tags)}
author: "Omni-Bot"
slug: "${post.slug}"
---

# ${post.title}

${post.body}

## Why this matters in 2025

The landscape of ${
                post.tags[0]
            } is shifting rapidly. As we move further into the decade, trends like these will define the market.

## Conclusion

Stay tuned for more updates on this topic.
`;

            await fs.writeFile(filePath, frontmatter, "utf-8");
            logger.info(`Generated post: ${fileName}`);
        }

        logger.info("Seeding complete.");
    } catch (error) {
        logger.error("Seeding failed", { error });
        process.exit(1);
    }
}

seedContent();
