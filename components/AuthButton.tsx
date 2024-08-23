import { getAuthenticatedAppForUser } from "@/utils/firebase/serverApp";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const { currentUser: user } = await getAuthenticatedAppForUser();

  const signOut = async () => {
    "use server";

    await signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.displayName}!<Link href={`/agent`}>Agent View</Link>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <>
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Agent Login
      </Link>
      <Link href="/ask">Ask a Question</Link>
    </>
  );
}
