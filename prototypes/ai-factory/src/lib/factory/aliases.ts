import type { CommerceAliasLookup, CommerceAliasWriter } from "./commerce-key";
import type { FactorySql } from "./db";

export function createSqlAliasStore(
  sql: FactorySql,
): CommerceAliasLookup & CommerceAliasWriter {
  return {
    async findCanonical(alias) {
      const rows = await sql`
        SELECT canonical FROM factory_commerce_aliases
        WHERE alias = ${alias}
        LIMIT 1
      `;
      const canonical = rows[0]?.canonical;
      return typeof canonical === "string" ? canonical : null;
    },
    async link(canonical, aliases) {
      for (const alias of aliases) {
        await sql`
          INSERT INTO factory_commerce_aliases (alias, canonical)
          VALUES (${alias}, ${canonical})
          ON CONFLICT (alias) DO UPDATE SET canonical = EXCLUDED.canonical
        `;
      }
    },
  };
}
