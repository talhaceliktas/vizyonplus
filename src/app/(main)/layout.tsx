import { Toaster } from "react-hot-toast";
import { poppins } from "@public/fonts/fonts";
import Footer from "@shared/components/layout/Footer";

const AnaLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className={`from-primary-950 via-primary-800/40 to-primary-950 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 min-h-screen bg-linear-to-l antialiased transition-colors duration-300 ${poppins.className}`}
    >
      {children}
      <Toaster position="bottom-right" />
      <Footer />
    </main>
  );
};

export default AnaLayout;
