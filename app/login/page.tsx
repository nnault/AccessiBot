"use client";

import {
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { firebaseApp } from "@/utils/firebase/clientApp";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Login = () => {
  const router = useRouter();
  /*const signUp = async (data: FormData) => {
    "use server";

    const email = data.get("email");
    const password = data.get("password");
    const displayName = data.get("displayName") as string;
    createUserWithEmailAndPassword(
      getAuth(firebaseApp),
      email as string,
      password as string
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
        /*updateProfile(user, {
          displayName: displayName,
        }).then(() => {
          // Profile updated!
          console.log("profile updated.");
          // ..
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        // ..
      });
  };
  const login = async (data: FormData) => {
    "use server";
    const email = data.get("email");
    const password = data.get("password");

    signInWithEmailAndPassword(
      getAuth(firebaseApp),
      email as string,
      password as string
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        console.log(user);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };*/
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  return (
    <div>
      <h1>Login/Signup</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          value="login"
          name="action"
          onClick={async (e) => {
            e.preventDefault();
            try {
              const user = await signInWithEmailAndPassword(
                getAuth(firebaseApp),
                email,
                password
              );
              router.push("/");
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Login
        </button>
        <label htmlFor="displayName">Display Name</label>
        <input
          type="text"
          placeholder="Display Name"
          id="displayName"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            try {
              const user = await createUserWithEmailAndPassword(
                getAuth(firebaseApp),
                email,
                password
              );
              console.warn(user);
              await updateProfile(user.user, {
                displayName: displayName,
              });
              router.push("/");
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Signup
        </button>
      </form>
    </div>
  );
};
export default Login;
