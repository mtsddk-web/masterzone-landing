import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col">
        {post.image && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-primary bg-secondary/50 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <time className="text-xs text-gray-500" dateTime={post.publishedAt}>
              {formattedDate}
            </time>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
            {post.description}
          </p>
          <div className="mt-4 text-primary font-semibold text-sm flex items-center gap-1">
            Czytaj dalej
            <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
