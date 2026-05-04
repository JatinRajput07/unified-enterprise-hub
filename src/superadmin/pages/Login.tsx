import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useSuperAdminStore } from "@/store/superAdminStore";
import { SAButton } from "../components/SAPage";

export default function SALogin() {
  const navigate = useNavigate();
  const login = useSuperAdminStore(s => s.login);
  const [step, setStep] = useState<1|2>(1);
  const [email, setEmail] = useState("rahul@yourdomain.com");
  const [password, setPassword] = useState("supersecret");
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  const next = () => {
    setErr("");
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("Invalid email format"); return; }
    if (password.length < 4) { setErr("Invalid credentials"); return; }
    setStep(2);
  };
  const submit = () => {
    setErr("");
    if (otp.length !== 6) { setErr("Invalid 2FA code"); return; }
    if (login(email, password, otp)) navigate("/super-admin/dashboard");
    else setErr("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: "hsl(var(--sa-accent))" }}>⬡</div>
          <div>
            <div className="text-lg font-semibold">Super Admin</div>
            <div className="text-xs text-muted-foreground">Product Owner Console</div>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium">Email</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium">Password</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={show ? "text" : "password"} className="w-full h-10 pl-9 pr-9 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={() => setShow(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {err && <div className="text-xs text-destructive">{err}</div>}
            <SAButton onClick={next}><span className="w-full">Continue</span></SAButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md p-3">
              <ShieldCheck className="w-4 h-4" /> Enter the 6-digit code from your authenticator app.
            </div>
            <div>
              <label className="text-xs font-medium">2FA Code</label>
              <input maxLength={6} className="mt-1 w-full h-12 text-center tracking-[10px] font-mono text-lg rounded-md border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-indigo-200" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,""))} placeholder="------" />
            </div>
            {err && <div className="text-xs text-destructive">{err}</div>}
            <div className="flex gap-2">
              <SAButton variant="outline" onClick={() => setStep(1)}>Back</SAButton>
              <SAButton onClick={submit}><span className="flex-1 text-center">Sign In</span></SAButton>
            </div>
          </div>
        )}

        <p className="text-2xs text-muted-foreground mt-6 text-center">
          🔒 This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
