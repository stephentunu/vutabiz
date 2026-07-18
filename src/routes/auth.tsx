import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header, Footer } from "@/components/site-chrome";
import { Loader2 } from "lucide-react";

const search = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  component: AuthPage,
});

type County = { id: number; name: string };
type Ward = { id: number; county_id: number; name: string };

function AuthPage() {
  const navigate = useNavigate();
  const { next } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [counties, setCounties] = useState<County[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [countyId, setCountyId] = useState<number | "">("");
  const [wardId, setWardId] = useState<number | "">("");
  const [town, setTown] = useState("");
  const [building, setBuilding] = useState("");

  useEffect(() => {
    supabase.from("counties").select("id,name").order("name").then(({ data }) => setCounties((data as County[]) ?? []));
    supabase.from("wards").select("id,county_id,name").order("name").then(({ data }) => setWards((data as Ward[]) ?? []));
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: next ?? "/dashboard" }); });
  }, [navigate, next]);

  const wardsForCounty = useMemo(() => wards.filter((w) => w.county_id === Number(countyId)), [wards, countyId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!fullName || !phone || !countyId) throw new Error("Name, phone and county are required");
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName, phone,
              county_id: String(countyId), ward_id: wardId ? String(wardId) : "",
              town, building,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate({ to: next ?? (email === "admins@gmail.com" ? "/admin" : "/dashboard") });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center py-14 px-4 bg-background">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl ring-1 ring-black/5 p-8">
          <h1 className="text-2xl font-extrabold text-primary-dark">{mode === "signin" ? "Welcome back" : "Create your Vutabiz account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to sell, buy and make offers." : "Sell locally across Kenya — free to start."}</p>

          <div className="mt-5 flex rounded-full bg-muted p-1 text-sm font-semibold">
            <button onClick={() => setMode("signin")} className={`flex-1 rounded-full py-2 transition ${mode === "signin" ? "bg-primary text-white" : "text-muted-foreground"}`}>Sign in</button>
            <button onClick={() => setMode("signup")} className={`flex-1 rounded-full py-2 transition ${mode === "signup" ? "bg-primary text-white" : "text-muted-foreground"}`}>Sign up</button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <>
                <Input label="Full name" value={fullName} onChange={setFullName} required />
                <Input label="Phone (07xx…)" value={phone} onChange={setPhone} required />
              </>
            )}
            <Input label="Email" type="email" value={email} onChange={setEmail} required />
            <Input label="Password" type="password" value={password} onChange={setPassword} required />

            {mode === "signup" && (
              <div className="pt-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Location</div>
                <div className="grid grid-cols-2 gap-2">
                  <Select label="County" value={countyId} onChange={(v) => { setCountyId(v === "" ? "" : Number(v)); setWardId(""); }} options={[{ value: "", label: "Select…" }, ...counties.map((c) => ({ value: c.id, label: c.name }))]} />
                  <Select label="Ward" value={wardId} onChange={(v) => setWardId(v === "" ? "" : Number(v))} options={[{ value: "", label: wardsForCounty.length ? "Select…" : "—" }, ...wardsForCounty.map((w) => ({ value: w.id, label: w.name }))]} disabled={!countyId} />
                  <Input label="Town / Estate" value={town} onChange={setTown} />
                  <Input label="Building / Landmark" value={building} onChange={setBuilding} />
                </div>
              </div>
            )}

            <button disabled={loading} className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark hover:bg-primary text-white px-4 py-3 font-bold transition disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
    </label>
  );
}

function Select({ label, value, onChange, options, disabled }: { label: string; value: number | ""; onChange: (v: number | "") => void; options: { value: number | ""; label: string }[]; disabled?: boolean }) {
  return (
    <label className="block text-sm">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary disabled:bg-muted">
        {options.map((o) => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
