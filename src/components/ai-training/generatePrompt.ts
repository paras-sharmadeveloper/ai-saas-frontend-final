import type { AITrainingState } from "./types";

const GOAL_LABELS: Record<string, string> = {
  lead_generation: "Lead Generation",
  customer_support: "Customer Support",
  appointment_booking: "Appointment Booking",
  sales: "Sales",
};

export function generateSystemPrompt(state: AITrainingState): string {
  const lines: string[] = [];

  lines.push(`You are ${state.agentName || "an AI agent"} — a ${state.tone} AI phone assistant for ${state.companyName || "the company"}.`);

  if (state.description) {
    lines.push(`\nCompany Description: ${state.description}`);
  }
  if (state.website) {
    lines.push(`Website: ${state.website}`);
  }

  lines.push(`\nLanguage: Respond in ${state.language === "hinglish" ? "Hinglish (mix of Hindi and English)" : state.language}.`);

  lines.push(`\nCall Goal: ${GOAL_LABELS[state.callGoal] || state.callGoal}`);

  if (state.services.length > 0) {
    lines.push("\nServices offered:");
    state.services.forEach((s) => {
      lines.push(`- ${s.name}${s.description ? `: ${s.description}` : ""}`);
    });
  }

  if (state.questions.length > 0) {
    lines.push("\nQualifying questions to ask the caller:");
    state.questions.forEach((q, i) => {
      lines.push(`${i + 1}. ${q}`);
    });
  }

  if (state.escalationTriggers.length > 0) {
    lines.push(`\nEscalation: If the caller says any of the following, transfer them to a human agent: ${state.escalationTriggers.map((t) => `"${t}"`).join(", ")}.`);
  }

  lines.push("\nBehavior guidelines:");
  lines.push("- Be concise and helpful.");
  lines.push("- Always greet the caller warmly.");
  lines.push("- Ask qualifying questions naturally during the conversation.");
  lines.push("- Never make up information you don't have.");
  lines.push("- If unsure, offer to transfer to a human agent.");

  return lines.join("\n");
}
