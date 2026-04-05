import AnnouncementBar from "@/components/AnnouncementBar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Benefits from "@/components/Benefits";
import Tools from "@/components/Tools";
import PainSection from "@/components/PainSection";
import HowItWorks from "@/components/HowItWorks";
import VideoTestimonial from "@/components/VideoTestimonial";
import Testimonials from "@/components/Testimonials";
import Transformation from "@/components/Transformation";
import ValueStack from "@/components/ValueStack";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import JoinSection from "@/components/JoinSection";
import CTA from "@/components/CTA";
import PriceComparison from "@/components/PriceComparison";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import FloatingHelpButton from "@/components/FloatingHelpButton";
import Footer from "@/components/Footer";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getHomepageContent } from "@/lib/content";

// Markdown loader — used for sections NOT managed by admin CMS
// (video, video-testimonial, tools, support, community, valuestack)
function getContentData(filename: string): any {
  const filePath = path.join(process.cwd(), "content", filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return data;
}

// Helper: extract numbered items from flat content (e.g. stat1_number, stat2_number → array)
function extractNumbered(
  content: Record<string, string>,
  prefix: string,
  count: number,
  fields: string[]
): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  for (let i = 1; i <= count; i++) {
    const item: Record<string, string> = {};
    let hasAny = false;
    for (const field of fields) {
      const key = `${prefix}${i}_${field}`;
      if (content[key]) {
        item[field] = content[key];
        hasAny = true;
      }
    }
    if (hasAny) items.push(item);
  }
  return items;
}

export default async function Home() {
  // Dynamic content from Supabase (merged with defaults)
  const c = await getHomepageContent();

  // Markdown-only sections (not in admin CMS)
  const videoData = getContentData("video.md");
  const videoTestimonialData = getContentData("video-testimonial.md");
  const toolsData = getContentData("tools.md");
  const supportData = getContentData("support.md");
  const communityData = getContentData("community.md");
  const valueStackData = getContentData("valuestack.md");

  // --- Build component props from flat content ---

  // Hero
  const heroProps = {
    preheadline: c.hero?.preheadline,
    headline: c.hero?.headline || '',
    description: c.hero?.description,
    ctaText: c.hero?.ctaText || 'Dołącz do MasterZone',
    ctaUrl: 'https://www.skool.com/masterzone',
    videoMediaId: videoData.mediaId,
    videoAspectRatio: videoData.aspectRatio,
    trialInfo: c.hero?.trialInfo,
    securityInfo: c.hero?.securityInfo,
  };

  // Stats
  const statsArray = extractNumbered(c.stats || {}, 'stat', 4, ['number', 'label', 'icon']);
  const statsMarkdown = getContentData("stats.md");
  const statsProps = {
    sectionTitle: c.stats?.sectionTitle || '',
    stats: statsArray.length > 0 ? statsArray : statsMarkdown.stats || [],
    highlights: statsMarkdown.highlights || [],
    footer: c.stats?.footer,
    note: statsMarkdown.note,
  };

  // Pain
  const painMarkdown = getContentData("pain1.md");
  const painItemsString = c.pain?.painItems || '';
  const painSections = painItemsString
    ? [{ title: 'Brzmi znajomo?', items: painItemsString.split('\n').filter((s: string) => s.trim()) }]
    : painMarkdown.sections || [];
  const painProps = {
    sectionTitle: c.pain?.sectionTitle || '',
    headline: c.pain?.headline || '',
    subheadline: c.pain?.subheadline || '',
    description: c.pain?.description || '',
    sections: painSections,
    mainHeadline: c.pain?.mainHeadline,
    mainContent: c.pain?.mainContent,
  };

  // Benefits
  const benefitsArray = extractNumbered(c.benefits || {}, 'benefit', 4, ['title', 'description']);
  const benefitsMarkdown = getContentData("benefits.md");
  const benefitsProps = {
    sectionTitle: c.benefits?.sectionTitle || '',
    sectionSubtitle: c.benefits?.sectionSubtitle || '',
    benefits: benefitsArray.length > 0
      ? benefitsArray.map((b, i) => ({
          icon: benefitsMarkdown.benefits?.[i]?.icon || '✅',
          title: b.title || '',
          description: b.description || '',
          checked: benefitsMarkdown.benefits?.[i]?.checked,
        }))
      : benefitsMarkdown.benefits || [],
  };

  // How It Works
  const stepsArray = extractNumbered(c.howitworks || {}, 'step', 3, ['title', 'description']);
  const howMarkdown = getContentData("howitworks.md");
  const howProps = {
    sectionTitle: c.howitworks?.sectionTitle || '',
    subtitle: c.howitworks?.subtitle || '',
    steps: stepsArray.length > 0
      ? stepsArray.map((s, i) => ({
          icon: howMarkdown.steps?.[i]?.icon || '⚙️',
          title: s.title || '',
          description: s.description || '',
        }))
      : howMarkdown.steps || [],
    closingText: c.howitworks?.closingText || '',
    infrastructure: c.howitworks?.infrastructure,
  };

  // Testimonials
  const testimonialsArray = extractNumbered(c.testimonials || {}, 't', 5, ['name', 'role', 'content']);
  const testimonialsMarkdown = getContentData("testimonials.md");
  const testimonialsProps = {
    sectionTitle: c.testimonials?.sectionTitle || '',
    testimonials: testimonialsArray.length > 0
      ? testimonialsArray.map((t, i) => ({
          name: t.name || '',
          role: t.role || '',
          content: t.content || '',
          avatar: testimonialsMarkdown.testimonials?.[i]?.avatar,
        }))
      : testimonialsMarkdown.testimonials || [],
  };

  // Transformation
  const transformSteps: { number: string; description: string }[] = [];
  for (let i = 1; i <= 5; i++) {
    const desc = c.transformation?.[`step${i}`];
    if (desc) transformSteps.push({ number: String(i), description: desc });
  }
  const transformMarkdown = getContentData("transformation.md");
  const transformProps = {
    headline: c.transformation?.headline || '',
    subtitle: c.transformation?.subtitle || '',
    steps: transformSteps.length > 0 ? transformSteps : transformMarkdown.steps || [],
    closingText: c.transformation?.closingText || '',
    ctaText: transformMarkdown.ctaText || 'Sprawdź to sam — dołącz do MasterZone',
    ctaUrl: transformMarkdown.ctaUrl || 'https://www.skool.com/masterzone',
  };

  // Pricing
  const pricingMarkdown = getContentData("pricing.md");
  const pricingProps = {
    sectionTitle: c.pricing?.sectionTitle || '',
    sectionSubtitle: c.pricing?.sectionSubtitle || '',
    urgencyAlert: pricingMarkdown.urgencyAlert,
    plans: pricingMarkdown.plans?.map((plan: any) => ({
      ...plan,
      name: c.pricing?.planName || plan.name,
      price: c.pricing?.price || plan.price,
      guarantee: c.pricing?.guarantee || plan.guarantee,
    })) || [],
  };

  // FAQ
  const faqItems: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 8; i++) {
    const q = c.faq?.[`q${i}`];
    const a = c.faq?.[`a${i}`];
    if (q && a) faqItems.push({ question: q, answer: a });
  }
  const faqMarkdown = getContentData("faq.md");
  const faqProps = {
    sectionTitle: c.faq?.sectionTitle || '',
    questions: faqItems.length > 0 ? faqItems : faqMarkdown.questions || [],
  };

  // Join Section
  const joinBlocks = extractNumbered(c.joinsection || {}, 'block', 2, ['title', 'description']);
  const joinMarkdown = getContentData("joinsection.md");
  const joinProps = {
    headline: c.joinsection?.headline || '',
    subtitle: c.joinsection?.subtitle || '',
    blocks: joinBlocks.length > 0
      ? joinBlocks.map((b, i) => ({
          icon: joinMarkdown.blocks?.[i]?.icon || '🧠',
          title: b.title || '',
          description: b.description || '',
        }))
      : joinMarkdown.blocks || [],
    contrastText: c.joinsection?.contrastText || '',
    ctaText: joinMarkdown.ctaText || 'Dołącz do MasterZone — 97 PLN/miesiąc',
    ctaUrl: joinMarkdown.ctaUrl || 'https://www.skool.com/masterzone',
    guarantee: joinMarkdown.guarantee,
    stats: joinMarkdown.stats,
  };

  // CTA
  const ctaProps = {
    headline: c.cta?.headline || '',
    subheadline: c.cta?.subheadline || '',
    buttonText: c.cta?.buttonText || 'Dołącz do MasterZone',
    buttonUrl: c.cta?.buttonUrl || 'https://www.skool.com/masterzone',
  };

  return (
    <main>
      {pricingProps.urgencyAlert && (
        <AnnouncementBar message={pricingProps.urgencyAlert} />
      )}
      <Hero {...heroProps} />
      <Stats {...statsProps} />
      <VideoTestimonial {...videoTestimonialData} />
      <PainSection {...painProps} />
      <Benefits {...benefitsProps} />
      <HowItWorks {...howProps} />
      <Tools {...toolsData} />
      <Tools {...supportData} />
      <Tools {...communityData} />
      <Testimonials {...testimonialsProps} />
      <Transformation {...transformProps} />
      <ValueStack {...valueStackData} />
      <PriceComparison />
      <Pricing {...pricingProps} />
      <div id="faq">
        <FAQ {...faqProps} />
      </div>
      <JoinSection {...joinProps} />
      <CTA {...ctaProps} />

      {/* Exit Intent Popup - CRO boost */}
      <ExitIntentPopup />

      {/* Floating Help Button - Secondary CTA */}
      <FloatingHelpButton />

      {/* Footer with real links */}
      <Footer />
    </main>
  );
}
