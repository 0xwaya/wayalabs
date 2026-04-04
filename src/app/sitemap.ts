import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/data/case-studies";
import { insightPosts } from "@/lib/data/insights";

const BASE_URL = "https://wayalabs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/ai-solutions`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/ai-solutions/chatbots`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/ai-solutions/agents`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/ai-solutions/integrations`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/case-studies`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/process`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/about`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/insights`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/contact`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${BASE_URL}/case-studies/${study.id}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const insightRoutes = insightPosts.map((post) => ({
    url: `${BASE_URL}/insights/${post.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...insightRoutes];
}
