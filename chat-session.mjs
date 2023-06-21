import { Configuration, OpenAIApi } from "openai";
import { exit } from "node:process";

export class ChatSession {
  openai;
  messages = [];
  /** @type Array<{fn:T->any, schema:JsonSchema<T> }> */
  functions;

  constructor({ apiKey, functions }) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
    this.functions = functions;
  }

  /**
   * Push a new message from our end (either a user prompt or a function response).
   *
   * All previous messages will also be included.
   * The response message will be added to `this.messages` and included in future messages.
   *
   * If the response is a function call, the function call will be evaluated, and then more chat completions requested recursively.
   *
   * The first chat message response is returned.
   **/
  async postMessage(message) {
    this.messages.push(message);
    this.logMessage(message);
    let apiResponse;
    try {
      apiResponse = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: this.messages,
        functions: this.functions.map((func) => func.schema),
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      exit(1);
    }

    const responseMessage = apiResponse.data.choices[0].message;
    this.messages.push(responseMessage);
    this.logMessage(responseMessage);

    if (responseMessage.function_call) {
      return await this.handleFunctionCallMessage(responseMessage);
    } else {
      return responseMessage;
    }
  }

  logMessage(message) {
    console.log(`[Message ${this.messages.length}]:`, message);
  }

  printMessage(message) {
    if (message.function_call) {
      const { name, arguments: args } = message;
      console.log(`  ${name}(${args})`);
    } else if (message.role === "function") {
      console.log(`${message.name}(): ${message.content}`);
    } else {
      console.log(`${message.role}: ${message.content}`);
    }
  }

  /** Hande a message received from OpenAI, either a function call or a blah */
  async handleFunctionCallMessage(message) {
    if (!message.function_call) {
      throw new Error("Expected message to be a function call");
    }
    const result = await this.callFunctionFromMessage(message);
    const functionResultMessage = {
      role: "function",
      name: message.function_call.name,
      content: JSON.stringify(result),
    };
    return await this.postMessage(functionResultMessage);
  }

  async callFunctionFromMessage(message) {
    for (const availableFunction of this.functions) {
      if (message.function_call.name === availableFunction.schema.name) {
        const fnArgs = JSON.parse(message.function_call.arguments);
        console.log(`Calling ${message.function_call.name} with args:`, fnArgs);
        const result = await availableFunction.fn(fnArgs);
        console.log(`Result: `, result);
        return result;
      }
    }
    const availableNames = this.functions.map((f) => f.schema.name).join(", ");
    throw new Error(
      `Requested function ${message.function_call.name} not found in ${availableNames}`
    );
  }
}
