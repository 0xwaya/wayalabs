import { beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "./route";
import { resetState } from "@/lib/engine/orchestrator";

beforeEach(() => {
  resetState();
});

describe("GET /api/factory", () => {
  it("returns orchestrator state", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.factories).toHaveLength(3);
    expect(body.commandLevel).toBe(1);
  });
});

describe("POST /api/factory", () => {
  it("ticks the simulation", async () => {
    const response = await POST(
      new Request("http://localhost/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tick" }),
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.tick).toBe(1);
  });

  it("starts a mission", async () => {
    const response = await POST(
      new Request("http://localhost/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "startMission", missionId: "ms-fl-batch" }),
      }),
    );
    const body = await response.json();
    expect(body.missions.find((m: { id: string }) => m.id === "ms-fl-batch").status).toBe(
      "active",
    );
  });

  it("selects a factory", async () => {
    const response = await POST(
      new Request("http://localhost/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "selectFactory",
          factoryId: "fx-forge-line",
        }),
      }),
    );
    const body = await response.json();
    expect(body.selectedFactoryId).toBe("fx-forge-line");
  });

  it("rejects invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("rejects unknown actions", async () => {
    const response = await POST(
      new Request("http://localhost/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "explode" }),
      }),
    );
    expect(response.status).toBe(400);
  });

  it("requires missionId for startMission", async () => {
    const response = await POST(
      new Request("http://localhost/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "startMission" }),
      }),
    );
    expect(response.status).toBe(400);
  });
});
