import { ChatSession } from "./chat-session.mjs";
import { BrowserSession, getTextFromPage } from "./browser-session.mjs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { URLSearchParams } from "node:url";

async function getUrl({ searchTerm }) {
  const query = new URLSearchParams({ q: searchTerm }).toString();
  await browserSession.gotoUrl(`https://duckduckgo.com/?${query}`);
  // Todo: use something that's not a testID... or use a real search API, or something
  const firstLink = browserSession.page
    .getByTestId("result")
    .first()
    .getByTestId("result-title-a");
  const href = await firstLink.getAttribute("href");
  return href;
}

const functions = [
  {
    fn: async ({ searchTerm }) => await getUrl({ searchTerm }),
    schema: {
      name: "getUrl",
      description: "Search for a website and open the first result",
      parameters: {
        type: "object",
        properties: {
          searchTerm: {
            type: "string",
            description: "The search term to use when finding the website.",
          },
        },
      },
    },
  },
  {
    fn: async ({ url }) => {
      console.log("FUNCTION openPage:", url);
      await browserSession.gotoUrl(url);
      return { loaded: true };
    },
    schema: {
      name: "openPage",
      description: "Load a page in a web browser from its URL",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The URL of the website we should open.",
          },
        },
      },
    },
  },
  {
    fn: async () => getTextFromPage(browserSession.page),
    schema: {
      name: "getTextFromPage",
      description:
        "Retrieve the text from the current page. Must call `openPage` first",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

const rl = readline.createInterface({ input, output });
const initialPrompt = await rl.question("Prompt for the assistant:");

const chatSession = new ChatSession({
  apiKey: process.env.OPENAI_API_KEY,
  functions,
});

const browserSession = new BrowserSession();
await browserSession.init();

const message1 = {
  role: "user",
  content: initialPrompt,
};

const response = await chatSession.postMessage(message1);

chatSession.printMessage(response);

await browserSession.end();
rl.close();
