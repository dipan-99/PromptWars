import Link from "next/link";
import { ShieldCheck, FileText, AlertTriangle, Scale, Lock, RefreshCw, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold tracking-tight">LexGuard</span>
        </div>
        <Link 
          href="/analyze" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Try LexGuard
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI-Powered Legal Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
            Know What You're Signing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Before You Sign It
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl">
            An AI-powered platform that analyzes legal documents to detect harmful, exploitative, ambiguous, or high-risk clauses in seconds.
          </p>
          <Link 
            href="/analyze" 
            className="group bg-blue-600 hover:bg-blue-500 text-white text-lg px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            Analyze a Contract
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* How It Works */}
        <section className="bg-slate-900 border-y border-slate-800 py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-800/50">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Upload Document</h3>
                <p className="text-slate-400">Upload any contract (PDF, DOCX, TXT) or paste raw text securely.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-800/50">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
                <p className="text-slate-400">Our advanced AI scans every line to extract and evaluate key clauses.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-800/50">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Detect Risks</h3>
                <p className="text-slate-400">Get plain-language explanations of hidden risks and actionable advice.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Documents & Use Cases */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Protect Yourself Across All Agreements</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We support a wide range of legal and quasi-legal documents including Employment Contracts, Vendor Agreements, Subscription Terms, Rental Agreements, Privacy Policies, Platform Terms of Service, Insurance Policies, and Freelance Agreements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Employment Agreements",
                desc: "Detecting restrictive non-compete clauses and unfair termination conditions.",
                icon: <Lock className="w-5 h-5" />,
              },
              {
                title: "Subscription Contracts",
                desc: "Identifying hidden cancellation penalties and auto-renewal traps.",
                icon: <FileText className="w-5 h-5" />,
              },
              {
                title: "Freelance Agreements",
                desc: "Highlighting broad IP ownership transfers that could limit your future work.",
                icon: <Scale className="w-5 h-5" />,
              },
              {
                title: "Privacy Policies",
                desc: "Detecting excessive personal data collection and third-party sharing.",
                icon: <ShieldCheck className="w-5 h-5" />,
              },
              {
                title: "Platform T&Cs",
                desc: "Identifying one-sided arbitration mechanisms and liability waivers.",
                icon: <AlertTriangle className="w-5 h-5" />,
              },
              {
                title: "Vendor Agreements",
                desc: "Detecting ambiguous liability limitations and indemnification clauses.",
                icon: <RefreshCw className="w-5 h-5" />,
              },
            ].map((useCase, idx) => (
              <div key={idx} className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 mb-4 border border-slate-700">
                  {useCase.icon}
                </div>
                <h4 className="text-lg font-bold mb-2">{useCase.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 mb-4 text-sm flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <strong>Disclaimer:</strong> LexGuard is an AI tool for educational and awareness purposes. It is not a substitute for professional legal advice.
          </p>
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} LexGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
