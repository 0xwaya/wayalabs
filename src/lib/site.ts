import { discoveryCreditSentence } from "@/lib/data/offers";

/**
 * List Offers in the header, mobile menu, and footer.
 * /services permanently redirects to /offers (one commercial ladder).
 */
export const showOffersInNavigation = true;

/** One description for the document head, Open Graph, Twitter, and JSON-LD. */
export const siteDescription =
  `Wayalabs builds a custom web stack and automation for the business. Chatbots are live. Agents and orchestrators stay in research. ${discoveryCreditSentence}`;
