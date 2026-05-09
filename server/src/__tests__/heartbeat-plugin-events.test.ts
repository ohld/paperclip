import { describe, expect, it } from "vitest";
import { buildRunLifecyclePluginPayload } from "../services/heartbeat.ts";

describe("buildRunLifecyclePluginPayload", () => {
  it("uses issue and routine context as the Telegram-compatible run subject", () => {
    const payload = buildRunLifecyclePluginPayload({
      run: {
        id: "run-123",
        agentId: "agent-123",
        status: "running",
        invocationSource: "assignment",
        triggerDetail: "system",
        error: null,
        errorCode: null,
        startedAt: new Date("2026-05-09T12:00:00.000Z"),
        finishedAt: null,
      },
      agentName: "QA Engineer",
      issueId: "issue-123",
      issue: {
        id: "issue-123",
        identifier: "FFM-1105",
        title: "QA Log Scan",
        status: "in_progress",
      },
      routine: {
        id: "routine-123",
        title: "QA Log Scan",
      },
    });

    expect(payload).toMatchObject({
      agentId: "agent-123",
      agentName: "FFM-1105: QA Log Scan",
      agentActualName: "QA Engineer",
      issueId: "issue-123",
      issueIdentifier: "FFM-1105",
      issueTitle: "QA Log Scan",
      issueStatus: "in_progress",
      routineId: "routine-123",
      routineTitle: "QA Log Scan",
      runDisplayName: "FFM-1105: QA Log Scan",
      startedAt: "2026-05-09T12:00:00.000Z",
    });
  });

  it("falls back to the real agent name when a run is not tied to an issue", () => {
    const payload = buildRunLifecyclePluginPayload({
      run: {
        id: "run-456",
        agentId: "agent-456",
        status: "succeeded",
        invocationSource: "on_demand",
        triggerDetail: "manual",
        error: null,
        errorCode: null,
        startedAt: null,
        finishedAt: new Date("2026-05-09T12:05:00.000Z"),
      },
      agentName: "CTO",
      issueId: null,
      issue: null,
      routine: null,
    });

    expect(payload).toMatchObject({
      agentName: "CTO",
      agentActualName: "CTO",
      issueId: null,
      runDisplayName: "CTO",
      finishedAt: "2026-05-09T12:05:00.000Z",
    });
  });
});
