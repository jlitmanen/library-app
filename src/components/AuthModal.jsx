import React, { useState } from "react";
import pb from "../pocketbase";
import { FileText } from "lucide-react";

export default function AuthModal({ onAuth }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await pb.collection("users").authWithPassword(email, pass);
      } else {
        await pb
          .collection("users")
          .create({ email, password: pass, passwordConfirm: pass });
        await pb.collection("users").authWithPassword(email, pass);
      }
      onAuth();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-100 p-6">
      <div className="bg-white rounded-[40px] shadow-2xl p-12 w-full max-w-110 border border-white/20">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 rotate-6 shadow-xl shadow-blue-200">
          <FileText className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
          {isLogin ? "Welcome" : "Join Us"}
        </h2>
        <p className="text-slate-500 font-medium mb-10">
          Capture family memories together.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98] mt-4">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-8 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isLogin ? "Need an account? Sign up" : "Already a member? Sign in"}
        </button>
      </div>
    </div>
  );
}
