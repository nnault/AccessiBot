"use server";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/utils/firebase/serverApp";

import invariant from "tiny-invariant";
export const sendMessage = async (data: FormData) => {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const messageText = data.get("message") as string;
  const questionID = data.get("questionID") as string;
  const type = data.get("type") as string;

  // If the user is an agent, use their display name
  // Otherwise, use the display name from the question

  let displayName = "";
  invariant(messageText, "Message text is required");
  invariant(questionID, "Question ID is required");
  if (type === "agent") {
    displayName = currentUser?.displayName ?? "Agent";
  } else {
    const questionDoc = await getDoc(
      doc(collection(db, "questions"), questionID)
    );
    displayName = questionDoc.data()?.displayName;
  }
  invariant(displayName, "Display name is required");
  //insert the message into firebase
  await addDoc(collection(db, "messages"), {
    messageText,
    questionID,
    displayName,
    createdAt: serverTimestamp(),
  });
};
