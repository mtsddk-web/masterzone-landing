import AnnouncementBar from "@/components/AnnouncementBar";
import Hero from "@/components/Hero";
import Video from "@/components/Video";
import Stats from "@/components/Stats";
import Benefits from "@/components/Benefits";
import Tools from "@/components/Tools";
import PainSection from "@/components/PainSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Transformation from "@/components/Transformation";
import ValueStack from "@/components/ValueStack";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import JoinSection from "@/components/JoinSection";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import FloatingHelpButton from "@/components/FloatingHelpButton";

// Import content from markdown files
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function getContentData(filename: string): any {
  const filePath = path.join(process.cwd(), "content", filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return data;
}

export default function Home() {
  // Load all content
  const heroData = getContentData("hero.md");
  const videoData = getContentData("video.md");
  const statsData = getContentData("stats.md");
  const benefitsData = getContentData("benefits.md");
  const toolsData = getContentData("tools.md");
  const supportData = getContentData("support.md");
  const communityData = getContentData("community.md");
  const pain1Data = getContentData("pain1.md");
  const pain2Data = getContentData("pain2.md");
  const howItWorksData = getContentData("howitworks.md");
  const testimonialsData = getContentData("testimonials.md");
  const transformationData = getContentData("transformation.md");
  const valueStackData = getContentData("valuestack.md");
  const pricingData = getContentData("pricing.md");
  const faqData = getContentData("faq.md");
  const joinSectionData = getContentData("joinsection.md");
  const ctaData = getContentData("cta.md");

  return (
    <main>
      {pricingData.urgencyAlert && (
        <AnnouncementBar message={pricingData.urgencyAlert} />
      )}
      <Hero {...heroData} videoMediaId={videoData.mediaId} videoAspectRatio={videoData.aspectRatio} />
      {/* Video section moved to Hero - keeping this commented for now
      <Video {...videoData} />
      */}
      <Stats {...statsData} />
      <Benefits {...benefitsData} />
      <Tools {...toolsData} />
      <Tools {...supportData} />
      <Tools {...communityData} />
      <PainSection {...pain1Data} />
      <PainSection {...pain2Data} />
      <HowItWorks {...howItWorksData} />
      <Testimonials {...testimonialsData} />
      <Transformation {...transformationData} />
      <ValueStack {...valueStackData} />
      <Pricing {...pricingData} />
      <div id="faq">
        <FAQ {...faqData} />
      </div>
      <JoinSection {...joinSectionData} />
      <ContactForm
        headline="Dołącz do MasterZone już teraz"
        subheadline="Podaj swoje dane, a za chwilę przekierujemy Cię do społeczności"
        ctaText="Dołącz teraz →"
        source="landing_page_form"
      />
      <CTA {...ctaData} />

      {/* Exit Intent Popup - CRO boost */}
      <ExitIntentPopup />

      {/* Floating Help Button - Secondary CTA */}
      <FloatingHelpButton />
    </main>
  );
}
