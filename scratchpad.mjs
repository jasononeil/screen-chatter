import { Configuration, OpenAIApi } from "openai";
import { exit } from "process";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function getUrl({ name }) {
  console.log("GetURL: ", name);
  if (name.toLowerCase() === "abc") {
    return "https://abc.net.au/";
  }
  if (name.toLowerCase() === "abc news") {
    return "https://abc.net.au/news";
  }
  if (name.toLowerCase() === "hacker news") {
    return "https://news.ycombinator.com";
  }
  if (name.toLowerCase() === "the atlantic") {
    return "https://theatlantic.com";
  }
}

const getUrlSchema = {
  name: "getUrl",
  description: "Get the URL for a given website",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of the website.",
      },
    },
  },
};

function openPage({ url }) {
  console.log("Let's load URL:", url);
  return { loaded: true };
}

const openPageSchema = {
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
};

function getTextFromPage() {
  return ` 	Hacker News new | threads | past | comments | ask | show | jobs | submit 	joneil (350) | logout
  1. 	
    Our Plan for Python 3.13 (github.com/faster-cpython)
    89 points by bratao 1 hour ago | flag | hide | 33 comments
  2. 	
    Effective Rust (lurklurk.org)
    207 points by FL33TW00D 3 hours ago | flag | hide | 38 comments
  3. 	
    Cement's future could be a combination of Carbon Capture and Electrification (industrydecarbonization.com)
    52 points by hannob 2 hours ago | flag | hide | 24 comments
  4. 	
    DeSantis signs car dealership bill banning most direct-to-consumer auto sales (floridapolitics.com)
    6 points by twiddling 15 minutes ago | flag | hide | 1 comment
  5. 	
    Quake's lightning gun bug explained (youtube.com)
    280 points by henning 9 hours ago | flag | hide | 116 comments
  6. 	
    FANN: Vector Search in 200 Lines of Rust (fennel.ai)
    50 points by ingve 3 hours ago | flag | hide | 11 comments
  7. 	
    How to crawl a quarter billion webpages in 40 hours (2012) (michaelnielsen.org)
    112 points by swyx 6 hours ago | flag | hide | 33 comments
  8. 	
    The Stupid Programmer Manifesto (hasen.substack.com)
    94 points by hsn915 2 hours ago | flag | hide | 92 comments
  9. 	
    Germany wants to legalize quality control of illegal drugs (spiegel.de)
    107 points by tfourb 2 hours ago | flag | hide | 84 comments
  10. 		JetPack Aviation (YC W19) Is Hiring (ycombinator.com)
    2 hours ago | hide
  11. 	
    Behaviour Driven Development with 6502 code (github.com/martinpiper)
    22 points by ingve 3 hours ago | flag | hide | 1 comment
  12. 	
    Thinking Like Transformers (2021) [pdf] (arxiv.org)
    59 points by jbay808 5 hours ago | flag | hide | 8 comments
  13. 	
    ESP32-C3 Wireless Adventure: A Comprehensive Guide to IoT [pdf] (espressif.com)
    176 points by sohkamyung 10 hours ago | flag | hide | 77 comments
  14. 	
    This Week in Rust 499 (this-week-in-rust.org)
    75 points by unripe_syntax 6 hours ago | flag | hide | 2 comments
  15. 	
    To Understand the Past, Pick Up an Old Magazine (nytimes.com)
    46 points by ingve 4 hours ago | flag | hide | 31 comments
  16. 	
    Bioacoustics: Finding the Voices of Other Species (worldsensorium.com)
    19 points by dnetesn 3 hours ago | flag | hide | 1 comment
  17. 	
    Reduce Friction (ceejbot.com)
    27 points by luu 6 hours ago | flag | hide | 3 comments
  18. 	
    SETI scientists to devise plan for lunar listening station (supercluster.com)
    125 points by yk 13 hours ago | flag | hide | 86 comments
  19. 	
    Network of channels tried to saturate YouTube with pro-Bolsonaro content (phys.org)
    46 points by belter 2 hours ago | flag | hide | 3 comments
  20. 	
    Building a platform that open sources itself (zed.dev)
    32 points by signa11 5 hours ago | flag | hide | 5 comments
  21. 	
    Men who helped run Megaupload sentenced to prison in New Zealand (go.com)
    63 points by jacquesm 2 hours ago | flag | hide | 48 comments
  22. 	
    Lessons Learned from 11 Years of Hosting a SaaS (ghiculescu.substack.com)
    234 points by ghiculescu 8 hours ago | flag | hide | 159 comments
  23. 	
    Eyewitness Accounts of the 1906 San Francisco Earthquake (publicdomainreview.org)
    26 points by samclemens 8 hours ago | flag | hide | 16 comments
  24. 	
    Conflict-Driven Synthesis for Layout Engines (acm.org)
    14 points by luu 2 hours ago | flag | hide | 3 comments
  25. 	
    The Guardian bans all gambling advertising (theguardian.com)
    134 points by CaptainZapp 2 hours ago | flag | hide | 84 comments
  26. 	
    On the slow productivity of John Wick (calnewport.com)
    278 points by lawgimenez 12 hours ago | flag | hide | 146 comments
  27. 	
    Man found UC Berkeley skeleton in 2021 (berkeleyscanner.com)
    63 points by yawnxyz 11 hours ago | flag | hide | 29 comments
  28. 	
    Native JSON Output from GPT-4 (yonom.substack.com)
    547 points by yonom 18 hours ago | flag | hide | 231 comments
  29. 	
    I booted Linux 293k times in 21 hours (rwmj.wordpress.com)
    752 points by jandeboevrie 1 day ago | flag | hide | 249 comments
  30. 	
    Launch HN: Credal.ai (YC W23) – Data Safety for Enterprise AI
    104 points by r_thambapillai 22 hours ago | flag | hide | 23 comments
    More
  
  Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact
  
  Search: `;
}

const getTextFromPageSchema = {
  name: "getTextFromPage",
  description:
    "Retrieve the text from the current page. Must call `openPage` first",
  parameters: {
    type: "object",
    properties: {},
  },
};

async function postMessages(messages) {
  try {
    return await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: messages,
      functions: [getUrlSchema, openPageSchema, getTextFromPageSchema],
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

function handleMessage(message) {
  console.log(message);
  if (!message.function_call) {
    console.log(message.role, ":", message.content);
    exit();
  }
  const result = callFunctionFromMessage(message);
  return {
    role: "function",
    name: message.function_call.name,
    content: JSON.stringify(result),
  };
}

function callFunctionFromMessage(message) {
  if (!message.function_call) {
    console.log("Message was not a function call. Message was:", message);
  } else if (message.function_call.name === "getUrl") {
    return getUrl(JSON.parse(message.function_call.arguments));
  } else if (message.function_call.name === "openPage") {
    return openPage(JSON.parse(message.function_call.arguments));
  } else if (message.function_call.name === "getTextFromPage") {
    return getTextFromPage();
  }
}

const message1 = {
  role: "user",
  content: "What Rust stories are on Hacker News today?",
};

const chat_completion_1 = await postMessages([message1]);

console.log(JSON.stringify(chat_completion_1.data, null, 2));

const message2 = chat_completion_1.data.choices[0].message;

const message3 = handleMessage(message2);

console.log("Message 2", message2);
console.log("Message 3", message3);

const chat_completion_2 = await postMessages([message1, message2, message3]);

console.log(JSON.stringify(chat_completion_2.data, null, 2));

const message4 = chat_completion_2.data.choices[0].message;
console.log("Message 4", message4);

const message5 = handleMessage(message4);
console.log("Message 5", message5);

const chat_completion_3 = await postMessages([
  message1,
  message2,
  message3,
  message4,
  message5,
]);

console.log(JSON.stringify(chat_completion_3.data, null, 2));

const message6 = chat_completion_3.data.choices[0].message;
console.log("Message 6", message6);

const message7 = handleMessage(message6);
console.log("Message 7", message7);

const chat_completion_4 = await postMessages([
  message1,
  message2,
  message3,
  message4,
  message5,
  message6,
  message7,
]);

console.log(JSON.stringify(chat_completion_4.data, null, 2));

const message8 = chat_completion_4.data.choices[0].message;
handleMessage(message8);
