import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "Neon Fit",
  description: "Weight & fitness tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-[100svh] pb-[96px]">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
