import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  title: string;
  slug: string;
  publishedAt: string;
  author: string;
  image: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const today = new Date().toISOString().split("T")[0];

  const posts = files
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        title: data.title || "",
        slug: data.slug || filename.replace(".md", ""),
        publishedAt: data.publishedAt || "",
        author: data.author || "Mateusz Dudek",
        image: data.image || "",
        description: data.description || "",
        category: data.category || "",
        tags: data.tags || [],
        content,
      } as BlogPost;
    })
    .filter((post) => post.publishedAt <= today && post.title)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  const posts = getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
