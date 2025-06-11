// src/index.ts
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// A static set of jokes for demonstration
const jokes = [
  {
    type: "general",
    content: "Why don't scientists trust atoms? Because they make up everything!"
  },
  {
    type: "general",
    content: "I told my computer I needed a break, and now it won't stop sending me KitKats."
  },
  {
    type: "knock-knock",
    content: "Knock knock. Who's there? Lettuce. Lettuce who? Lettuce in, it's cold out here!"
  },
  {
    type: "dad",
    content: "I would tell you a joke about construction, but I'm still working on it."
  },
  {
    type: "general",
    content: "Parallel lines have so much in common. It’s a shame they’ll never meet."
  }
];

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Joke Teller",
    version: "1.0.0"
  });

  async init() {
    // Tell a random joke
    this.server.tool(
      "tell_joke",
      "Tell a random joke to the user",
      {},
      async (_params, _context) => {
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        return {
          content: [{ type: "text", text: joke.content }]
        };
      }
    );

    // Tell a joke by type
    this.server.tool(
      "tell_typed_joke",
      "Tell a joke of a specified type (e.g. general, knock-knock, dad)",
      {
        type: z.string().describe("Type of joke: general, knock-knock, dad")
      },
      async ({ type }, _context) => {
        const typeLower = type.toLowerCase();
        const filtered = jokes.filter(j => j.type === typeLower);
        if (filtered.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `Sorry, I don't know any '${type}' jokes yet! Try: general, knock-knock, or dad.`
              }
            ]
          };
        }
        const joke = filtered[Math.floor(Math.random() * filtered.length)];
        return {
          content: [{ type: "text", text: joke.content }]
        };
      }
    );

    // List all available joke types
    this.server.tool(
      "list_joke_types",
      "List all available joke types",
      {},
      async (_params, _context) => {
        const uniqueTypes = Array.from(new Set(jokes.map(j => j.type)));
        return {
          content: [
            {
              type: "text",
              text: `Available joke types: ${uniqueTypes.join(", ")}`
            }
          ]
        };
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }
    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }
    return new Response("Not found", { status: 404 });
  }
};
