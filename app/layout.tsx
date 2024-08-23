import { getAuthenticatedAppForUser } from "@/utils/firebase/serverApp";
import { GeistSans } from "geist/font/sans";
import "@/css/normalize.css";
import "@/css/style.css";
import "./globals.css";
import Header from "@/components/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
export const dynamic = "force-dynamic";
export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Accessibot",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = await getAuthenticatedAppForUser();
  console.log("currentUser", currentUser);
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <nav>
          <Header initialUser={currentUser?.toJSON()} />
        </nav>
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
