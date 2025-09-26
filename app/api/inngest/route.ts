import { serve } from "inngest/next";
import { inngest } from "@/inngest/clint";
import helloFn from "@/inngest/hello-fn"; 

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloFn],
});