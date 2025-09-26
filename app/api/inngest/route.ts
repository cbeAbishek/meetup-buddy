import { serve } from "inngest/next";
import { inngest } from "@/inngest/clint";
import helloFn from "@/inngest/hello-fn";
import scheduleMeetingFn from "@/inngest/schedule-meeting";
import { chatbotFn, schedulingIntentFn } from "@/inngest/chatbot";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloFn, scheduleMeetingFn, chatbotFn, schedulingIntentFn],
});