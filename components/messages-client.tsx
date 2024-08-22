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
  questionID,
}: {
  messages: Tables<"messages">[];
  questionID: string;
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
      .channel(`messages question_id=eq.${questionID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `question_id=eq.${questionID}`,
        },
        async (payload: any) => {
          console.log("Change received!", payload);

          //speak message if checkbox is checked

          if ((await localStorage.getItem("shouldSpeak")) === "true") {
            speak(`${payload.new.display_name}: ${payload.new.message_text}`);
          }
          setMessagesState((messages: Tables<"messages">[]) => [
            ...messages,
            payload.new,
          ]);
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const [shouldSpeakState, setShouldSpeakState] = useState("");
  useEffect(() => {
    if (shouldSpeakState !== "")
      localStorage.setItem("shouldSpeak", shouldSpeakState.toString());
  }, [shouldSpeakState]);
  //check for shouldSpeak on first render and set state
  useEffect(() => {
    const shouldSpeak = localStorage.getItem("shouldSpeak");
    if (shouldSpeak) {
      setShouldSpeakState(parseBoolean(shouldSpeak).toString());
    }
  }, []);
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
