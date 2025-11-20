import fs from "fs/promises";
import path from "path";
import { PostMap } from "../types";
import { logger } from "./logger";

const STATE_FILE = path.resolve(process.cwd(), ".postmap.json");

export async function loadState(): Promise<PostMap> {
    try {
        const data = await fs.readFile(STATE_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        logger.warn("No existing state file found, starting fresh.");
        return {};
    }
}

export async function saveState(state: PostMap): Promise<void> {
    try {
        await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
    } catch (error) {
        logger.error("Failed to save state file", { error });
    }
}

export async function updatePostState(
    slug: string,
    platform: string,
    url: string,
    postId: string
): Promise<void> {
    const state = await loadState();

    if (!state[slug]) {
        state[slug] = {};
    }

    state[slug][platform] = {
        url,
        postId,
        publishedAt: new Date().toISOString(),
    };

    await saveState(state);
}

export async function isPublished(
    slug: string,
    platform: string
): Promise<boolean> {
    const state = await loadState();
    return !!(state[slug] && state[slug][platform]);
}
