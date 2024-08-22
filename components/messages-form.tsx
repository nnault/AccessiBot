"use client";
import { sendMessage } from "@/actions/messages";
import { useRef } from "react";
export const MessagesForm = ({
  questionID,
  type,
}: {
  questionID: string;
  type: string;
}) => {
  const messageInput = useRef<HTMLTextAreaElement>(null);
  console.log(`messageFormType=${type}`);
  return (
    <div className="chat-input">
      <form
        action={async (data: FormData) => {
          await sendMessage(data);
          if (messageInput.current) messageInput.current.value = "";
        }}
      >
        <label htmlFor="message">Message:</label>
        <br />
        <textarea
          id="message"
          ref={messageInput}
          name="message"
          placeholder="Enter your message here"
          cols={17}
          rows={0}
        />
        <br />
        <br />
        <input type="hidden" name="questionID" value={questionID} />
        <input type="hidden" name="type" value={type} />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
