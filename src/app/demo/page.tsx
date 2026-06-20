import type { Metadata } from "next";
import DemoExperience from "./DemoExperience";

export const metadata: Metadata = {
  title: "Prueba el chatbot — Closer AI",
  description:
    "Completa tus datos y prueba una simulación del chatbot de agendamiento por WhatsApp de Closer AI.",
};

export default function DemoPage() {
  const realChatEnabled = process.env.WEBCHAT_REAL_ENABLED === "true";
  return <DemoExperience realChatEnabled={realChatEnabled} />;
}
