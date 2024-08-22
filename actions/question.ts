"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import invariant from "tiny-invariant";
export const sendQuestion = async (data: FormData) => {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const questionText = data.get("questionText") as string;
  const displayName = data.get("displayName") as string;
  const { data: newQuestion, error } = await supabase
    .from("questions")
    .insert({
      question_text: questionText,
      display_name: displayName,
      user_id: user.user?.id,
      answered: false,
    })
    .select();
  if (error) {
    console.error("Error sending question:", error);
  } else {
    console.log("Question sent:", newQuestion);
    invariant(newQuestion, "Question not found");
    return redirect(`/chat/${newQuestion[0].id}/customer`);
  }
};
