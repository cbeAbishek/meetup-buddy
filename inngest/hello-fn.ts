import { inngest } from "./clint";

export default inngest.createFunction(
  { id: "hello-world" },
  { event: "app/hello" },
  async ({ event, step }) => {
    console.log("hello event:", event.data);
    return { ok: true };
  }
);
