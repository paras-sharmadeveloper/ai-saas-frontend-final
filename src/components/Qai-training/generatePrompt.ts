import type { AITrainingState } from "./types";

export function generateSystemPrompt(state: AITrainingState): string {
  const lines: string[] = [];

  lines.push(`You are an AI voice agent for ${state.companyName || "the company"}.`);

  if (state.website) lines.push(`Website: ${state.website}`);
  if (state.description) lines.push(`About: ${state.description}`);
  if (state.scannedContent) lines.push(`Additional context: ${state.scannedContent}`);
  if (state.services.length) lines.push(`Services offered: ${state.services.join(", ")}`);

  lines.push(`Tone: ${state.tone}`);
  lines.push(`Language: ${state.language}`);
  if (state.agentName) lines.push(`Your name is: ${state.agentName}`);
  if (state.callGoal) lines.push(`Primary goal: ${state.callGoal.replace("_", " ")}`);

  if (state.questions.length) {
    lines.push(`\nAsk these qualifying questions:`);
    state.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  }

  if (state.escalationTriggers.length) {
    lines.push(`\nEscalate to a human when caller says: ${state.escalationTriggers.join(", ")}`);
  }

  return lines.join("\n");
}
