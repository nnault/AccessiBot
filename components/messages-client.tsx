"use client";
import { useRef } from "react";
import type { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
function parseBoolean(value: string | null): boolean {
  return value?.toLowerCase() === "true";
}
export const MessagesClient = ({
  messages,
}: {
  messages: Tables<"messages">[];
}) => {
  //function that speaks a message
  const speak = (message: string) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(message);
    synth.speak(utterThis);
  };
  //subscribe to messages
  const [messagesState, setMessagesState] =
    useState<Tables<"messages">[]>(messages);
  const supabase = createClient();
  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          console.log("Change received!", payload);
          setMessagesState((messages: Tables<"messages">[]) => [
            ...messages,
            payload.new,
          ]);

          //speak message if checkbox is checked
          if (localStorage.getItem("shouldSpeak") === "true") {
            speak(payload.new.message_text);
          }
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const [shouldSpeakState, setShouldSpeakState] = useState(
    parseBoolean(localStorage.getItem("shouldSpeak")?.toString() ?? "false")
  );
  return (
    <div>
      <div role="log" aria-live="polite" aria-relevant="additions text">
        <label htmlFor="shouldSpeak">Speak messages:</label>
        <input
          type="checkbox"
          id="shouldSpeak"
          checked={shouldSpeakState}
          onChange={(e) => {
            localStorage.setItem("shouldSpeak", e.target.checked.toString());
            setShouldSpeakState(e.target.checked);
          }}
        />
        <ul className="chatbox">
          {messagesState.map((message) => (
            <li key={message.id} className="chat-incoming chat">
              {message.display_name}: {message.message_text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
