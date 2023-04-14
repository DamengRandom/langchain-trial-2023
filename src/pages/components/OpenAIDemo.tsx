import React, { useEffect, useState } from "react";
import { OpenAI } from "langchain/llms/openai";
// import { PromptTemplate } from "langchain/prompts";
// import { LLMChain } from "langchain/chains";
import { CallbackManager } from "langchain/callbacks";
import useTypewriter from "react-typewriter-hook";

// const openAiCaller = async (question: string): Promise<string> => {
//   const model = new OpenAI({
//     openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//     temperature: 0.9,
//     streaming: true,
//     callbackManager: CallbackManager.fromHandlers({
//       async handleLLMNewToken(token: string) {
//         process.stdout.write(token);
//       },
//     }),
//   });
//   const template = "Who is {name}?";
//   const prompt = new PromptTemplate({
//     template,
//     inputVariables: ["name"],
//   });

//   const chain = new LLMChain({ llm: model, prompt });

//   const res = await chain.call({ name: question });

//   return res?.text;
// };

// Simple straming query ~~
const openAiStream = async (question: string): Promise<string> => {
  const model = new OpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    temperature: 0.9,
    streaming: true,
    callbackManager: CallbackManager.fromHandlers({
      async handleLLMNewToken(token: string) {
        process.stdout.write(token);
      },
    }),
  });

  const res = await model.call(question);

  return res;
};

// TypeWriter component
function TypewriterEffect({ promise }: { promise: Promise<string> }) {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    promise.then((result) => setAnswer(result));
  }, [promise]);

  const text = useTypewriter(answer || "");

  return (
    <div className="text-2xl font-bold">
      {(text || "").split("").map((char: string, index: number) => (
        <span key={index} className="opacity-1 animate-typewriter">
          {char}
        </span>
      ))}
    </div>
  );
}

export default function OpenAIDemo() {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div>
      <h3>OpenAIDemo</h3>
      <div>
        <input
          className="text-red-600"
          name="question"
          type="text"
          value={query}
          onChange={(event: { target: { value: string } }) => {
            console.log(event.target.value);
            setQuery(event.target.value);
          }}
        />
        <button
          type="submit"
          onClick={() => setShow(true)}
          className="text-red-600"
        >
          Showtime !!
        </button>
      </div>
      <div>
        {show && !!query && (
          <div style={{ width: 600 }}>
            {/* <TypewriterEffect promise={openAiCaller(query)} /> */}
            <TypewriterEffect promise={openAiStream(query)} />
            <button
              onClick={() => {
                setQuery("");
                setShow(false);
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
