import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Benefits from "@/components/Benefits";
import Tools from "@/components/Tools";
import PainSection from "@/components/PainSection";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

// Import content from markdown files
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function getContentData(filename: string) {
  const filePath = path.join(process.cwd(), "content", filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return data;
}

export default function Home() {
  // Load all content
  const heroData = getContentData("hero.md");
  const statsData = getContentData("stats.md");
  const benefitsData = getContentData("benefits.md");
  const toolsData = getContentData("tools.md");
  const supportData = getContentData("support.md");
  const communityData = getContentData("community.md");
  const pain1Data = getContentData("pain1.md");
  const pain2Data = getContentData("pain2.md");
  const pricingData = getContentData("pricing.md");
  const testimonialsData = getContentData("testimonials.md");
  const faqData = getContentData("faq.md");
  const ctaData = getContentData("cta.md");

  return (
    <main>
      <Hero {...heroData} />
      <Stats {...statsData} />
      <Benefits {...benefitsData} />
      <Tools {...toolsData} />
      <Tools {...supportData} />
      <Tools {...communityData} />
      <PainSection {...pain1Data} />
      <PainSection {...pain2Data} />
      <Testimonials {...testimonialsData} />
      <Pricing {...pricingData} />
      <FAQ {...faqData} />
      <CTA {...ctaData} />
    </main>
  );
}
