import fs from "fs/promises";
import path from "path";
import { parseMarkdownFile } from "./utils/markdown";
import { logger } from "./utils/logger";

const POSTS_DIR = path.resolve(process.cwd(), "content/posts");
const PUBLIC_DIR = path.resolve(process.cwd(), "public");

async function buildSite() {
    logger.info("Building Static Site...");

    // Ensure public dir exists
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // Read Posts
    const files = await fs.readdir(POSTS_DIR);
    const posts = [];

    for (const file of files) {
        if (file.endsWith(".md")) {
            const post = await parseMarkdownFile(path.join(POSTS_DIR, file));
            posts.push(post);
        }
    }

    // Sort by date desc
    posts.sort(
        (a, b) =>
            new Date(b.frontmatter.date).getTime() -
            new Date(a.frontmatter.date).getTime()
    );

    // Generate Index HTML
    let postsHtml = "";
    for (const post of posts) {
        postsHtml += `
      <article class="post-preview">
        <h2><a href="#" onclick="togglePost('${post.slug}')">${
            post.frontmatter.title
        }</a></h2>
        <div class="meta">
          <span>${post.frontmatter.date}</span> |
          <span>${(post.frontmatter.tags || []).join(", ")}</span>
        </div>
        <p>${post.frontmatter.description}</p>
        <div id="${post.slug}" class="post-content" style="display:none;">
          ${post.html}
        </div>
      </article>
    `;
    }

    const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Omni-Publisher Archive</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Omni-Publisher Archive</h1>
    <p>Automated Content Ecosystem</p>
  </header>
  <main>
    ${postsHtml}
  </main>
  <script>
    function togglePost(slug) {
      const el = document.getElementById(slug);
      if (el.style.display === 'none') {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  </script>
</body>
</html>
  `;

    await fs.writeFile(path.join(PUBLIC_DIR, "index.html"), indexHtml);

    // Generate CSS
    const css = `
body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; background: #f4f4f9; color: #333; }
header { text-align: center; margin-bottom: 3rem; }
h1 { color: #2c3e50; }
.post-preview { background: white; padding: 2rem; margin-bottom: 2rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.meta { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
.post-content { margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem; }
a { color: #3498db; text-decoration: none; cursor: pointer; }
a:hover { text-decoration: underline; }
pre { background: #f8f8f8; padding: 1rem; overflow-x: auto; border-radius: 4px; }
img { max-width: 100%; height: auto; }
  `;

    await fs.writeFile(path.join(PUBLIC_DIR, "styles.css"), css);

    logger.info("Static Site Build Complete.");
}

buildSite().catch((error) => {
    logger.error("Build Site Failed", { error });
    process.exit(1);
});
