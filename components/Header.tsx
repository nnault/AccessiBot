"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
} from "@/utils/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/utils/firebase/firestore.js";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "@/utils/firebase/config";

function useUserSession(initialUser: any) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: any) => {
      setUser(authUser);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: any) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return user;
}
const Header = ({ initialUser }: { initialUser: any }) => {
  const handSignOut = async () => {
    await signOut();
  };

  const handLogin = async () => {
    await signInWithGoogle();
  };
  const user = useUserSession(initialUser);
  return (
    <div>
      {user ? (
        <>
          <div>
            Hello {user?.displayName}
            <Link href="/agent">Ag ent View</Link>
            <button onClick={handSignOut}>Sign Out</button>
          </div>
        </>
      ) : (
        <>
          <div>
            <Link href="/login">Agent Login</Link>
            <Link href="/ask">Ask a Question</Link>
            <button onClick={handLogin}>Sign In With Google</button>
          </div>
        </>
      )}
    </div>
  );
};
export default Header;
