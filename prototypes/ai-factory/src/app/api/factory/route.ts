import { NextResponse } from "next/server";
import {
  getState,
  resetState,
  selectFactory,
  startMission,
  tick,
} from "@/lib/engine/orchestrator";

export async function GET() {
  return NextResponse.json(getState());
}

type ActionBody =
  | { action: "tick" }
  | { action: "reset" }
  | { action: "selectFactory"; factoryId: string }
  | { action: "startMission"; missionId: string };

export async function POST(request: Request) {
  let body: ActionBody;
  try {
    body = (await request.json()) as ActionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  switch (body.action) {
    case "tick":
      return NextResponse.json(tick());
    case "reset":
      return NextResponse.json(resetState());
    case "selectFactory":
      if (!body.factoryId) {
        return NextResponse.json({ error: "factoryId required" }, { status: 400 });
      }
      return NextResponse.json(selectFactory(body.factoryId));
    case "startMission":
      if (!body.missionId) {
        return NextResponse.json({ error: "missionId required" }, { status: 400 });
      }
      return NextResponse.json(startMission(body.missionId));
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
