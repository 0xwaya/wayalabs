import Dashboard from "@/components/Dashboard";
import { withCommandLevel } from "@/lib/engine/orchestrator";
import { createSeedState } from "@/lib/engine/seed";

export default function Home() {
  // Fresh seed per request — gameplay runs client-side with local persistence.
  const initial = withCommandLevel(createSeedState());
  return <Dashboard initial={initial} />;
}
