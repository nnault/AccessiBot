import { MessagesServer } from "@/components/messages-server";
import { createClient } from "@/utils/supabase/server";
const Page = async ({ params }: { params: { id: string; type: string } }) => {
  const supabase = createClient();
  if (params.type === "agent") {
    await supabase
      .from("questions")
      .update({ answered: true })
      .eq("id", params.id);
  }

  const { data } = await supabase
    .from("questions")
    .select()
    .eq("id", params.id)
    .single();
  return (
    <div>
      <h1>Chat</h1>
      <h2>Question:{data?.question_text}</h2>
      <MessagesServer questionID={params.id} type={params.type} />
    </div>
  );
};
export default Page;
