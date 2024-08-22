"use client";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
const AgentClient = ({ questions }: { questions: Tables<"questions">[] }) => {
  const [questionsState, setQuestionsState] =
    useState<Tables<"questions">[]>(questions);
  const supabase = createClient();
  console.log("before effect.");
  useEffect(() => {
    // Subscribe to new questions

    let subscription: any;
    try {
      subscription = supabase
        .channel("agentQuestions")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "questions" },
          (payload: any) => {
            console.log("Change received!", payload);
            setQuestionsState((questions: Tables<"questions">[]) => [
              ...questions,
              payload.new,
            ]);
          }
        );
    } catch (e) {
      console.log(e);
    }

    return () => {
      subscription.unsubscribe();

      //updateSubscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {questionsState.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {questionsState.map((question) => (
              <tr key={question.id}>
                <td>
                  <Link target="_blank" href={`/chat/${question.id}/agent`}>
                    {question.question_text}
                  </Link>
                </td>
                <td>{question.display_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default AgentClient;
