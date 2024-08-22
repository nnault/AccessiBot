import AgentServer from "@/components/AgentServer";
import { createClient } from "@/utils/supabase/server";
const page = async () => {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div>
      <h1>Agent View</h1>
      <AgentServer />
    </div>
  );
};
export default page;
