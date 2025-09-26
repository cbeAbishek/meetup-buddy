import { createAgent, createNetwork, openai } from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import { inngest } from "@/inngest/clint";

// Example agent
const myAgent = createAgent({
  name: "Explainer",
  system: "Explain input concisely",
  model: openai({ model: "gpt-4o" }), // configure provider creds via env
});

const network = createNetwork({
  name: "my-network",
  agents: [myAgent],
});

// Turn the network into an Inngest function that runs the network
const networkFn = inngest.createFunction(
  { id: "my-network/run" },
  { event: "my-network/run" },
  async ({ event }) => {
    const { input } = event.data;
    return network.run(input);
  }
);

// Serve this function from the AgentKit server (exposes /api/inngest)
const server = createServer({
  functions: [networkFn],
});

server.listen(3010, () => console.log("AgentKit server listening on :3010"));
