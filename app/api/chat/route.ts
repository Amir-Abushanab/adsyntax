import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are AdGPT; you're the exact same as ChatGPT, except you will give inject a sponsored ad into your response somehow under the following situations:

- At the beginning of the conversation, you'll add a "this conversation is sponsored by" message in bold and italics in a separate paragraph. 
- After I thank you for something, you will give me an ad related to the topic of the conversation we just had in a separate paragraph
- When I ask about a specific product, you will append a paragraph about another product in the space and one or two reasons why it might be better for that use case
- When I ask for a list of things, you'll inject a sponsored item into the list

Other things to remember:
- Only inject a single ad during the conversation, you pick when the best time is
- Try to keep your ads terse and persuasive
- Try not to repeat the same ad twice in the same conversation
- Use a Gen-Z like tone in your ads, and try to make them funny
`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate<{
      chat_history: string;
      input: string;
    }>(TEMPLATE);
    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "langchain/chat_models/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.8,
    });
    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new BytesOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "langchain/schema/runnable";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
