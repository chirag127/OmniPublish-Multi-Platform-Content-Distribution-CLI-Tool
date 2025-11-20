import fs from "fs/promises";
import path from "path";
import frontMatter from "front-matter";
import showdown from "showdown";
import { BlogPost } from "../types";

const converter = new showdown.Converter({
    tables: true,
    tasklists: true,
    strikethrough: true,
    ghCodeBlocks: true,
});

export async function parseMarkdownFile(filePath: string): Promise<BlogPost> {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsed = frontMatter<any>(fileContent);

    const slug = parsed.attributes.slug || path.basename(filePath, ".md");

    // Ensure date is a string
    if (parsed.attributes.date && parsed.attributes.date instanceof Date) {
        parsed.attributes.date = parsed.attributes.date
            .toISOString()
            .split("T")[0];
    }

    return {
        filePath,
        slug,
        frontmatter: parsed.attributes,
        content: parsed.body,
        html: converter.makeHtml(parsed.body),
    };
}

export function sanitizeForPlatform(content: string, platform: string): string {
    // Platform specific sanitization can go here
    // For now, return raw content or HTML depending on platform needs
    return content;
}
