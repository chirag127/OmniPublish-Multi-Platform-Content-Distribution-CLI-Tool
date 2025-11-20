export interface BlogPost {
    filePath: string;
    slug: string;
    frontmatter: {
        title: string;
        description?: string;
        date: string;
        tags?: string[];
        author?: string;
        cover_image?: string;
        [key: string]: any;
    };
    content: string; // Markdown content
    html?: string; // Rendered HTML
}

export interface PublishResult {
    platform: string;
    success: boolean;
    url?: string;
    error?: string;
    postId?: string;
}

export interface PublisherAdapter {
    name: string;
    enabled: boolean;
    publish(post: BlogPost): Promise<PublishResult>;
}

export interface PostMap {
    [slug: string]: {
        [platform: string]: {
            url: string;
            postId: string;
            publishedAt: string;
        };
    };
}

export interface PublisherConfig {
    dryRun: boolean;
    concurrency: number;
}
