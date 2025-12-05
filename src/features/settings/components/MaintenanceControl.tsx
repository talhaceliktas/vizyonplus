import { ReactNode } from "react";
import supabaseServer from "@lib/supabase/server";
import MaintenancePage from "./MaintenancePage";

export default async function MaintenanceControl({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.role === "admin";

  if (isAdmin) {
    return children;
  }

  return <MaintenancePage />;
}
