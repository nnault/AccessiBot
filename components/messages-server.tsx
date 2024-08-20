import { createClient } from "@/utils/supabase/server";
import { MessagesClient } from "./messages-client";
import { MessagesForm } from "./messages-form";
export const MessagesServer = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("messages").select("*");
  return (
    <div>
      <h1>Messages</h1>
      <MessagesClient messages={data ?? []} />
      <MessagesForm />
    </div>
  );
};
