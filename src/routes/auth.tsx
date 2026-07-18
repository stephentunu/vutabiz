import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header, Footer } from "@/components/site-chrome";
import { Loader2, ShieldCheck, MapPin, User, Mail, Lock, Phone } from "lucide-react";

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
    supabase
      .from("counties")
      .select("id,name")
      .order("name")
      .then(({ data }) => setCounties((data as County[]) ?? []));
    supabase
      .from("wards")
      .select("id,county_id,name")
      .order("name")
      .then(({ data }) => setWards((data as Ward[]) ?? []));
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const userEmail = data.session.user?.email || "";
        navigate({ to: next ?? (userEmail.trim().toLowerCase() === "admins@gmail.com" ? "/admin" : "/dashboard") });
      }
    });
  }, [navigate, next]);

  const wardsForCounty = useMemo(
    () => wards.filter((w) => w.county_id === Number(countyId)),
    [wards, countyId],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!fullName || !phone || !countyId)
          throw new Error("Name, phone and county are required");
        if (phone.length < 10) throw new Error("Please enter a valid phone number");

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName,
              phone,
              county_id: String(countyId),
              ward_id: wardId ? String(wardId) : "",
              town: town || null,
              building: building || null,
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
      navigate({ to: next ?? (email.trim().toLowerCase() === "admins@gmail.com" ? "/admin" : "/dashboard") });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 grid place-items-center py-14 px-4 relative">
        <div
          aria-hidden
          className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-1/4 right-1/10 w-72 h-72 rounded-full bg-accent/5 blur-3xl"
        />

        <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl border border-border/40 p-8 z-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-primary-dark tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your Vutabiz account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to buy, sell and make offers locally."
                : "Join thousands of verified local traders across Kenya."}
            </p>
          </div>

          <div className="flex rounded-full bg-muted p-1 text-sm font-semibold mb-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full py-2.5 transition-all duration-300 ${mode === "signin" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full py-2.5 transition-all duration-300 ${mode === "signup" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  icon={User}
                  value={fullName}
                  onChange={setFullName}
                  placeholder="e.g. John Kamau"
                  required
                />
                <Input
                  label="Phone Number"
                  icon={Phone}
                  value={phone}
                  onChange={setPhone}
                  placeholder="e.g. 0712345678"
                  required
                />
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={setEmail}
              placeholder="name@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />

            {mode === "signup" && (
              <div className="pt-3 border-t border-border/50">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Location details
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="County *"
                    value={countyId}
                    onChange={(v) => {
                      setCountyId(v === "" ? "" : Number(v));
                      setWardId("");
                    }}
                    options={[
                      { value: "", label: "Select County" },
                      ...counties.map((c) => ({ value: c.id, label: c.name })),
                    ]}
                  />
                  <Select
                    label="Ward"
                    value={wardId}
                    onChange={(v) => setWardId(v === "" ? "" : Number(v))}
                    options={[
                      { value: "", label: wardsForCounty.length ? "Select Ward" : "—" },
                      ...wardsForCounty.map((w) => ({ value: w.id, label: w.name })),
                    ]}
                    disabled={!countyId}
                  />
                  <div className="col-span-1">
                    <Input
                      label="Town / Estate"
                      value={town}
                      onChange={setTown}
                      placeholder="e.g. Kilimani"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="Building / Landmark"
                      value={building}
                      onChange={setBuilding}
                      placeholder="e.g. Greenhouse"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark hover:bg-primary text-white px-4 py-3 font-bold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : mode === "signin" ? (
                "Sign In to Vutabiz"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="block">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm transition-all ${Icon ? "pl-9" : ""}`}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  options: { value: number | ""; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="block">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm disabled:bg-muted/70 disabled:cursor-not-allowed transition-all"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
