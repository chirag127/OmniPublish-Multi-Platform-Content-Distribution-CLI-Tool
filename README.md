# Omni-Publisher Content Ecosystem

> **One Markdown to Rule Them All.**
> Automatically publish your content to 17+ platforms, generate a static archive site, and manage everything via Git.

## 🚀 Features

-   **Write Once, Publish Everywhere**: Write in Markdown, publish to Dev.to, Medium, Hashnode, WordPress, Ghost, LinkedIn, Reddit, and more.
-   **Idempotency**: Never publish the same post twice. Tracks state in `.postmap.json`.
-   **Static Site Generator**: specific `npm run build-site` command generates a clean, SEO-friendly archive of all your posts.
-   **GitHub Actions**:
    -   `deploy-site.yml`: Deploys your archive to GitHub Pages.
    -   `publish-sync.yml`: Runs the publisher engine on a schedule (every 6 hours).
    -   `issue-to-post.yml`: Converts GitHub Issues with the `publish` label into blog posts.
-   **AI-Ready**: Includes a seed script to generate 50+ posts for testing.

## 🛠️ Supported Platforms

| Platform      | Auth Method       | Free Tier?     |
| ------------- | ----------------- | -------------- |
| **Dev.to**    | API Key           | ✅ Yes         |
| **Hashnode**  | PAT + Pub ID      | ✅ Yes         |
| **Medium**    | Integration Token | ✅ Yes         |
| **WordPress** | App Password      | ✅ Yes         |
| **Ghost**     | Admin API Key     | ✅ Yes         |
| **HubSpot**   | Access Token      | ⚠️ CMS Hub Req |
| **Showwcase** | API Key           | ✅ Yes         |
| **Blogger**   | OAuth 2.0         | ✅ Yes         |
| **Tumblr**    | OAuth 1.0a        | ✅ Yes         |
| **Wix**       | API Key           | ✅ Yes         |
| **Telegraph** | Access Token      | ✅ Yes         |
| **Mastodon**  | Access Token      | ✅ Yes         |
| **Notion**    | API Key           | ✅ Yes         |
| **Strapi**    | API Token         | ✅ Self-Hosted |
| **LinkedIn**  | OAuth 2.0         | ✅ Yes         |
| **Reddit**    | OAuth 2.0         | ✅ Yes         |
| **Discord**   | Webhook           | ✅ Yes         |

## 📦 Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/chirag127/omni-publisher6.git
    cd omni-publisher6
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Configure Environment**:
    - Copy `.env.example` to `.env`.
    - Fill in the API keys for the platforms you want to use.
    - **Note**: You don't need all keys. The system only enables adapters with valid credentials.

## 🏃 Usage

### 1. Generate Content

Create a new Markdown file in `content/posts/` or use the seed script:

```bash
npm run seed
```

### 2. Publish Content

Run the publisher engine. It will scan `content/posts/` and publish any new posts to enabled platforms.

```bash
npm run publish
```

_Use `--dry-run` to simulate publishing without making API calls._

### 3. Build Static Site

Generate the static HTML archive in `public/`:

```bash
npm run build-site
```

## 🤖 Automation

-   **Scheduled Publishing**: The `publish-sync` workflow runs every 6 hours. Ensure your GitHub Secrets are set up.
-   **Issue to Post**: Create an issue with the label `publish`. It will be automatically converted to a Markdown post and committed to the repo.

## 📂 Project Structure

```
├── .github/workflows/   # CI/CD Pipelines
├── content/posts/       # Markdown Source Files
├── public/              # Generated Static Site
├── src/
│   ├── adapters/        # Platform-specific logic
│   ├── data/            # Seed data
│   ├── utils/           # Helpers (Logger, Markdown, State)
│   ├── publish.ts       # Main Engine
│   ├── build-site.ts    # Static Site Generator
│   └── seed-content.ts  # Content Generator
├── .env.example         # API Key Template
├── .postmap.json        # State Tracking (Do not edit manually)
└── package.json         # Dependencies
```

## 📜 License

MIT
