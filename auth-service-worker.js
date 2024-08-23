import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

// this is set during install
let firebaseConfig;

firebaseConfig = {
  apiKey: "AIzaSyDPtZ7hIAh3eM4oC43d0di7kCHcNHIheh4",

  authDomain: "chat-rooms-d5ac3.firebaseapp.com",

  projectId: "chat-rooms-d5ac3",

  storageBucket: "chat-rooms-d5ac3.appspot.com",

  messagingSenderId: "492778811618",

  appId: "1:492778811618:web:ec806c700faaf4aef52ebb",
};

// Handle the 'install' event and extract the firebaseConfig from the query string if present
self.addEventListener("install", (event) => {
  const serializedFirebaseConfig = new URL(location).searchParams.get(
    "firebaseConfig"
  );

  if (serializedFirebaseConfig) {
    try {
      firebaseConfig = JSON.parse(serializedFirebaseConfig);
      console.log(
        "Service worker installed with Firebase config from query string",
        firebaseConfig
      );
    } catch (error) {
      console.error("Failed to parse Firebase config from query string", error);
    }
  } else {
    console.log(
      "Service worker installed with hardcoded Firebase config",
      firebaseConfig
    );
  }
});

self.addEventListener("fetch", (event) => {
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const installations = getInstallations(app);
  const headers = new Headers(request.headers);
  const [authIdToken, installationToken] = await Promise.all([
    getAuthIdToken(auth),
    getToken(installations),
  ]);
  headers.append("Firebase-Instance-ID-Token", installationToken);
  if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
  const newRequest = new Request(request, { headers });
  return await fetch(newRequest);
}

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
}
