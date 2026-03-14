import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — MasterZone | Produktywnosc, Deep Work, Praca Zdalna",
  description:
    "Artykuly o produktywnosci, pracy glebokiej, nawykach i pracy zdalnej. Praktyczne techniki dla soloprzedsiebiorcow i freelancerow.",
  openGraph: {
    title: "Blog — MasterZone",
    description: "Artykuly o produktywnosci, deep work i pracy zdalnej",
    url: "https://rozproszenie.masterzone.edu.pl/blog",
    siteName: "MasterZone",
    locale: "pl_PL",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-white section-padding">
        <div className="container-custom text-center">
          <Link href="/" className="text-blue-200 hover:text-white text-sm mb-4 inline-block transition-colors">
            &larr; Strona glowna
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog MasterZone</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Praktyczne techniki produktywnosci, deep work i pracy zdalnej.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="section-padding">
        <div className="container-custom">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Wkrotce pojawia sie tutaj artykuly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
