import Dashboard from "@/components/Dashboard";
import { getState } from "@/lib/engine/orchestrator";

export default function Home() {
  const initial = getState();
  return <Dashboard initial={initial} />;
}
