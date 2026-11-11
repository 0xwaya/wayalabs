import { discoveryCreditSentence } from "@/lib/data/offers";

/**
 * The /offers page stays published either way. Set this to true to list
 * Offers in the header, mobile menu, and footer again.
 */
export const showOffersInNavigation = false;

/** One description for the document head, Open Graph, Twitter, and JSON-LD. */
export const siteDescription =
  `Wayalabs builds a custom web stack and automation for the business. Chatbots are live. Agents and orchestrators stay in research. ${discoveryCreditSentence}`;
