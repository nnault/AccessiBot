import { createClient } from "@/utils/supabase/server";
import { MessagesClient } from "./messages-client";
import { MessagesForm } from "./messages-form";
export const MessagesServer = async ({
  questionID,
  type,
}: {
  questionID: string;
  type: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("question_id", questionID);

  return (
    <div>
      <h3>Messages</h3>
      <MessagesClient messages={data ?? []} questionID={questionID} />
      <MessagesForm questionID={questionID} type={type} />
    </div>
  );
};
