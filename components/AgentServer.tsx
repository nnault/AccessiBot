import AgentClient from "./AgentClient";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
const AgentServer = async () => {
  const supabase = createClient();
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("answered", false);
  return (
    <>
      <AgentClient questions={questions ?? []} />
    </>
  );
};
export default AgentServer;
