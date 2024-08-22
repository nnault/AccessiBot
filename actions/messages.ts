"use server";
import { createClient } from "@/utils/supabase/server";
import invariant from "tiny-invariant";
export const sendMessage = async (data: FormData) => {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const messageText = data.get("message") as string;
  const questionID = data.get("questionID") as string;
  const type = data.get("type") as string;
  console.log(`type=${type}`);
  const { data: question } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionID);
  invariant(question, "Question not found");
  // Send message to the database
  // If the user is an agent, use their display name
  // Otherwise, use the display name from the question
  const { data: newMessage, error } = await supabase.from("messages").insert([
    {
      message_text: messageText,
      user_id: user.user?.id,
      display_name:
        type === "agent"
          ? user.user?.user_metadata.displayName
          : question[0].display_name ?? "",
      question_id: +questionID,
    },
  ]);
  if (error) {
    console.error("Error sending message:", error);
  } else {
    console.log("Message sent:", newMessage);
  }
};
