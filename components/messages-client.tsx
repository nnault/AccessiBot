"use client";
import { useEffect, useState } from "react";
import { log } from "util";

function parseBoolean(value: string | null): boolean {
  return value?.toLowerCase() === "true";
}

export const MessagesClient = ({ messages }: { messages: MESSAGETYPE[] }) => {
  //function that speaks a message
  const speak = (message: string) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(message);
    synth.speak(utterThis);
  };
  const [shouldSpeakState, setShouldSpeakState] = useState(
    parseBoolean(localStorage.getItem("shouldSpeak")).toString()
  );

  useEffect(() => {
    if (messages.length === 0) return;
    const lastmessage = messages[messages.length - 1];
    speak(lastmessage.messageText);
  }, [messages]);

  useEffect(() => {
    messages.forEach((message) => {
      if (shouldSpeakState === "true") {
        console.log("text message", message.messageText);
        speak(message.messageText);
      }
    });
    async function setLocalStorage() {
      if (shouldSpeakState !== "")
        await localStorage.setItem("shouldSpeak", shouldSpeakState.toString());
    }
    setLocalStorage();
  }, [shouldSpeakState]);
  console.log("messages", messages);
  return (
    <div>
      <div role="log" aria-live="polite" aria-relevant="additions text">
        <label htmlFor="shouldSpeak">Speak messages:</label>
        <input
          type="checkbox"
          id="shouldSpeak"
          checked={parseBoolean(shouldSpeakState)}
          onChange={(e) => {
            setShouldSpeakState(e.target.checked.toString());
          }}
        />
        <ul className="chatbox">
          {messages.map((message) => (
            <li key={message.id} className="chat-incoming chat">
              {message.displayName}: {message.messageText}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
