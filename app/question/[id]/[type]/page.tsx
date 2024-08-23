import { MessagesServer } from "@/components/messages-server";
import { getFirestore } from "firebase/firestore";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "@/utils/firebase/serverApp";
const Page = async ({ params }: { params: { id: string; type: string } }) => {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();

  const db = getFirestore(firebaseServerApp);
  if (params.type === "agent") {
    //set question to answered
    const docRef = doc(db, "questions", params.id);
    await updateDoc(docRef, {
      answered: true,
    });
  }

  const docRef = doc(db, "questions", params.id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  console.log(data);
  return (
    <div>
      <h1>Chat</h1>
      <h2>Question:{data?.questionText}</h2>
      <MessagesServer questionID={params.id} type={params.type} />
    </div>
  );
};
export default Page;
