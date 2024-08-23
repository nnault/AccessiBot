"use client";
import { getFirestore, orderBy } from "firebase/firestore";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { MessagesClient } from "./messages-client";
import { MessagesForm } from "./messages-form";
import { firebaseApp } from "@/utils/firebase/clientApp";
import { useEffect, useState } from "react";
export const MessagesServer = ({
  questionID,
  type,
}: {
  questionID: string;
  type: string;
}) => {
  const [data, setData] = useState<MESSAGETYPE[]>([]);
  const db = getFirestore(firebaseApp);
  const q = query(
    collection(db, "messages"),
    where("questionID", "==", questionID),
    orderBy("createdAt")
  );

  const getdata = async () => {
    console.log("get data function");

    //const querySnapshot = await getDocs(q);
    const subscribe = onSnapshot(q, (querySnapshot) => {
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setData(data);
    });
    return subscribe;
  };
  useEffect(() => {
    getdata();
  }, []);
  return (
    <div>
      <h3>Messages</h3>
      <MessagesClient messages={data ?? []} />
      <MessagesForm questionID={questionID} type={type} />
    </div>
  );
};
