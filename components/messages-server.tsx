import { getFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/utils/firebase/serverApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MessagesClient } from "./messages-client";
import { MessagesForm } from "./messages-form";
export const MessagesServer = async ({
  questionID,
  type,
}: {
  questionID: string;
  type: string;
}) => {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const q = query(
    collection(db, "messages"),
    where("questionID", "==", questionID)
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => doc.data());
  return (
    <div>
      <h3>Messages</h3>
      <MessagesClient messages={data ?? []} questionID={questionID} />
      <MessagesForm questionID={questionID} type={type} />
    </div>
  );
};
