import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Providers } from "../_lib/next-theme/Providers";
import NavbarThemeChecker from "./NavbarThemeChecker";
import { Toaster } from "react-hot-toast";
import { poppins } from "../_lib/fontlar";
import { getCachedSettings, SiteSettings } from "../_lib/supabase/get-settings";

const AnaLayout = async ({ children }: { children: React.ReactNode }) => {
  const settings: SiteSettings = await getCachedSettings();

  return (
    <Providers>
      <NuqsAdapter>
        <main
          className={`from-primary-950 via-primary-800/40 to-primary-950 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 min-h-screen bg-gradient-to-l antialiased transition-colors duration-300 ${poppins.className}`}
        >
          <NavbarThemeChecker settings={settings} />
          {children}
          <Toaster position="bottom-right" />
        </main>
      </NuqsAdapter>
    </Providers>
  );
};

export default AnaLayout;
