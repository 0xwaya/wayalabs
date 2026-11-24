import { discoveryCreditSentence } from "@/lib/data/offers";

/**
 * List Offers in the header, mobile menu, and footer.
 * /services permanently redirects to /offers (one commercial ladder).
 */
export const showOffersInNavigation = true;

/** One description for the document head, Open Graph, Twitter, and JSON-LD. */
export const siteDescription =
  `Wayalabs builds lead systems for local trade and platforms for local listings. Chatbots ship inside those builds. Agents stay in research. ${discoveryCreditSentence}`;
