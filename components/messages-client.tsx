"use client";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseApp } from "@/utils/firebase/clientApp";

import { useRef } from "react";

import { useEffect, useState } from "react";
function parseBoolean(value: string | null): boolean {
  return value?.toLowerCase() === "true";
}
export const MessagesClient = ({
  messages,
  questionID,
}: {
  messages: any;
  questionID: string;
}) => {
  //function that speaks a message
  const speak = (message: string) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(message);
    synth.speak(utterThis);
  };
  //subscribe to messages
  const [messagesState, setMessagesState] = useState([]);

  const [shouldSpeakState, setShouldSpeakState] = useState(
    parseBoolean(localStorage.getItem("shouldSpeak")).toString()
  );

  const db = getFirestore(firebaseApp);
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("questionID", "==", questionID),
      orderBy("createdAt")
    );
    console.warn(`shouldSpeak outside of unsubscribe:${shouldSpeakState}`);
    const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
      querySnapshot.docChanges().forEach((change: any) => {
        if (change.type === "added") {
          setMessagesState((data) => [
            ...data,
            { id: change.doc.id, ...change.doc.data() },
          ]);
          console.warn(`shouldSpeakState: ${shouldSpeakState}`);
          if (shouldSpeakState === "true") {
            speak(change.doc.data().messageText);
          }
        }
      }); //end of querySnapshot
    }); //end of onSnapshot
    return unsubscribe;
  }, [questionID]); //end of useEffect
  useEffect(() => {
    async function setLocalStorage() {
      if (shouldSpeakState !== "")
        await localStorage.setItem("shouldSpeak", shouldSpeakState.toString());
    }
    setLocalStorage();
  }, [shouldSpeakState]);

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
            //setMessagesState([]);
          }}
        />
        <ul className="chatbox">
          {messagesState.map((message) => (
            <li key={message.id} className="chat-incoming chat">
              {message.displayName}: {message.messageText}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
