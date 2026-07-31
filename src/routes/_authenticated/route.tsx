import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Only run on the client — localStorage doesn't exist on the server,
    // so supabase.auth.getUser() / getSession() will always return nothing
    // server-side, causing every navigation to bounce back to /auth.
    if (typeof window === "undefined") return;

    // getSession() reads the stored JWT from localStorage without a network
    // round-trip. getUser() makes a network call to Supabase to validate the
    // JWT which can fail / be slow on the first render.
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw redirect({ to: "/auth", search: { next: location.pathname } });
    }
    return { user: data.session.user };
  },
  component: () => <Outlet />,
});