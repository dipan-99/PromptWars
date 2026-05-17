"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Dropzone } from "@/components/ui/Dropzone";
import { parseDocument } from "@/lib/parsers";
import { AnalysisResults } from "@/types";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { ClauseCard } from "@/components/ui/ClauseCard";
import { RiskChart } from "@/components/ui/RiskChart";

// PDF generation is now handled natively via window.print()

type Step = "UPLOAD" | "PROCESSING" | "RESULTS";

export default function AnalyzePage() {
  const [step, setStep] = useState<Step>("UPLOAD");
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("Initializing...");
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file && !rawText) return;

    setStep("PROCESSING");
    setIsProcessing(true);
    setError(null);

    try {
      let textToAnalyze = rawText;

      if (file && !rawText) {
        setProgressText("Parsing document...");
        textToAnalyze = await parseDocument(file);
      }

      setProgressText("Extracting clauses and evaluating risks...");
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze document");
      }

      setProgressText("Generating insights...");
      const data = await response.json();

      setResults(data);
      setStep("RESULTS");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStep("UPLOAD");
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePDF = () => {
    if (!results) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let html = "<html><head><title>LexGuard Report</title>";
    html +=
      "<style>body{font-family:Arial,sans-serif;padding:20px;color:#000;}";
    html += "h1{color:#1e3a5f;border-bottom:2px solid #1e3a5f;}";
    html += "h2{color:#1e3a5f;margin-top:20px;}";
    html += ".clause{border:1px solid #ccc;padding:15px;margin:10px 0;}";
    html += ".redflag{color:#dc2626;font-weight:bold;}";
    html += "</style></head><body>";
    html += "<h1>LexGuard Analysis Report</h1>";
    html +=
      "<p><strong>Contract Type:</strong> " + results.contractType + "</p>";
    html +=
      "<p><strong>Risk Score:</strong> " +
      results.overallRiskScore +
      "/100</p>";
    html +=
      "<p><strong>Risk Level:</strong> " + results.overallRiskLevel + "</p>";
    html += "<h2>Summary</h2><p>" + results.summary + "</p>";
    html += "<h2>Red Flags</h2>";
    results.redFlags.forEach(function (f: string) {
      html += '<p class="redflag">• ' + f + "</p>";
    });
    html += "<h2>Clauses</h2>";
    results.clauses.forEach(function (c: any) {
      html += '<div class="clause">';
      html += "<h3>" + c.title + " - " + c.riskLevel + "</h3>";
      html +=
        "<p><strong>Explanation:</strong> " +
        c.plainLanguageExplanation +
        "</p>";
      html += "<p><strong>Why Risky:</strong> " + c.whyItsRisky + "</p>";
      html +=
        "<p><strong>Recommendation:</strong> " + c.recommendation + "</p>";
      html += "</div>";
    });
    html += "<h2>Negotiation Recommendations</h2>";
    results.negotiationRecommendations.forEach(function (r: string) {
      html += "<p>• " + r + "</p>";
    });
    html +=
      '<p style="font-size:12px;color:#666;margin-top:30px;">LexGuard: Not legal advice.</p>';
    html += "</body></html>";

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function () {
      printWindow.print();
    }, 500);
  };

  const handleDownloadReport = () => {
    generatePDF();
  };

  const handleReset = () => {
    setStep("UPLOAD");
    setFile(null);
    setRawText("");
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold tracking-tight">LexGuard</span>
        </Link>
        <Link
          href="/"
          className="text-slate-400 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col max-w-6xl">
        {/* STEP 1: UPLOAD */}
        {step === "UPLOAD" && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4">Analyze a Contract</h1>
              <p className="text-slate-400">
                Upload your legal document to detect hidden risks and understand
                your rights.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <Dropzone
                onFileAccepted={handleFileUpload}
                isUploading={isProcessing}
              />

              {file && (
                <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="font-medium truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="my-8 flex items-center gap-4">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-slate-500 text-sm font-medium">
                  OR PASTE TEXT
                </span>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste contract text here..."
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none custom-scrollbar"
                disabled={isProcessing || file !== null}
              ></textarea>

              <button
                onClick={handleAnalyze}
                disabled={(!file && !rawText) || isProcessing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isProcessing ? "Processing..." : "Analyze Document"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === "PROCESSING" && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full py-20">
            <div className="w-24 h-24 relative mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-blue-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Document</h2>
            <p className="text-slate-400 text-center animate-pulse">
              {progressText}
            </p>

            <div className="w-full bg-slate-800 h-2 rounded-full mt-8 overflow-hidden">
              <div className="bg-blue-500 h-full w-2/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {step === "RESULTS" && results && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
                <p className="text-slate-400">
                  {results.contractType} • {results.clauses.length} clauses
                  analyzed
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadReport}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border border-slate-700"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                  onClick={handleReset}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Analyze Another
                </button>
              </div>
            </div>

            <div ref={reportRef} className="space-y-6">
              {/* Top Row: Summary & Chart */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Document Summary Card */}
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Risk Overview</h3>
                  <div className="flex flex-col items-center justify-center py-6 border-b border-slate-800 mb-6">
                    <div className="text-5xl font-black mb-2 flex items-baseline gap-1">
                      {results.overallRiskScore}{" "}
                      <span className="text-xl text-slate-500 font-medium">
                        / 100
                      </span>
                    </div>
                    <RiskBadge
                      level={results.overallRiskLevel}
                      className="scale-110"
                    />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {results.summary}
                  </p>
                </div>

                {/* Risk Distribution Chart */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Risk Distribution</h3>
                  <RiskChart distribution={results.riskDistribution} />
                </div>
              </div>

              {/* Red Flags Section */}
              {results.redFlags && results.redFlags.length > 0 && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Critical Red Flags
                  </h3>
                  <ul className="space-y-2">
                    {results.redFlags.map((flag, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-slate-300 text-sm"
                      >
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Negotiation Recommendations */}
              {results.negotiationRecommendations &&
                results.negotiationRecommendations.length > 0 && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" /> Recommended
                      Negotiation Points
                    </h3>
                    <ul className="space-y-3">
                      {results.negotiationRecommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800"
                        >
                          <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Clause Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">
                  Clause-by-Clause Breakdown
                </h3>
                <div className="space-y-4">
                  {results.clauses.map((clause, idx) => (
                    <ClauseCard key={idx} clause={clause} />
                  ))}
                  {results.clauses.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                      No distinct clauses identified in this document.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Disclaimer */}
      <footer className="bg-slate-950 py-4 border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            ⚠️ LexGuard provides AI-generated insights for awareness only. This
            is not legal advice. Always consult a qualified legal professional
            before signing any agreement.
          </p>
        </div>
      </footer>
    </div>
  );
}
