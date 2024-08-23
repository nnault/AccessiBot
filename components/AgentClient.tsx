"use client";
import { firebaseApp } from "@/utils/firebase/clientApp";

import {
  collection,
  onSnapshot,
  getDoc,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
const AgentClient = ({ questions }: { questions: any }) => {
  const [questionsState, setQuestionsState] = useState([]);
  const db = getFirestore(firebaseApp);
  console.log("before effect.");
  useEffect(() => {
    const q = query(
      collection(db, "questions"),
      where("answered", "==", false)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
      const data: any[] = [];
      querySnapshot.forEach((doc: any) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setQuestionsState(data);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      {questionsState?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {questionsState?.map((question: any) => (
              <tr key={question.id}>
                <td>
                  <Link target="_blank" href={`/question/${question.id}/agent`}>
                    {question.questionText}
                  </Link>
                </td>
                <td>{question.displayName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default AgentClient;
