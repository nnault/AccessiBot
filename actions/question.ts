"use server";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import invariant from "tiny-invariant";
import { getAuthenticatedAppForUser } from "@/utils/firebase/serverApp";
export const sendQuestion = async (data: FormData) => {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const questionText = data.get("questionText") as string;
  const displayName = data.get("displayName") as string;
  invariant(questionText, "Question text is required");
  invariant(displayName, "Display name is required");
  //insert the question into firebase

  const docRef = await addDoc(collection(db, "questions"), {
    questionText,
    displayName,
    createdAt: serverTimestamp(),
    answered: false,
  });
  console.log("Document written with ID: ", docRef.id);
  //redirect to the question page
  return redirect(`/question/${docRef.id}/customer`);
};
