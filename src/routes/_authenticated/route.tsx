import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      // Send the user to sign in / register, then bounce them back to
      // whatever protected page they were trying to reach (e.g. /sell).
      throw redirect({ to: "/auth", search: { next: location.pathname } });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});