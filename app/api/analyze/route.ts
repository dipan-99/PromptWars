import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are LexGuard, an expert AI legal analyst specializing in contract risk analysis. Your role is to analyze legal documents and identify clauses that could be harmful, exploitative, ambiguous, or high-risk for the individual or organization agreeing to them.
When given contract text, you must:

1. Detect the contract type
2. Extract every meaningful clause
3. Classify each clause by risk level: SAFE, LOW, MEDIUM, HIGH, or CRITICAL
4. Assign risk categories: Privacy, Financial, Employment, IP (Intellectual Property), Compliance, Ambiguity
5. Explain each clause in plain language (2-4 sentences, no legal jargon)
6. Explain why the clause is risky or noteworthy
7. Provide a specific, actionable negotiation recommendation
8. Compute an overall risk score from 0 to 100 (100 = extremely risky)

Respond ONLY in the following JSON format:
{
  "contractType": "string",
  "overallRiskScore": number,
  "overallRiskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "summary": "string (2-3 sentence summary of the document)",
  "redFlags": ["string", ...],
  "negotiationRecommendations": ["string", ...],
  "clauses": [
    {
      "title": "string",
      "originalText": "string",
      "riskLevel": "SAFE|LOW|MEDIUM|HIGH|CRITICAL",
      "riskCategories": ["Privacy|Financial|Employment|IP|Compliance|Ambiguity"],
      "plainLanguageExplanation": "string",
      "whyItsRisky": "string",
      "recommendation": "string"
    }
  ],
  "riskDistribution": {
    "privacy": number,
    "financial": number,
    "employment": number,
    "ip": number,
    "compliance": number,
    "ambiguity": number
  }
}

Train the prompt to look for and flag these specific clause types:
- Non-compete and non-solicitation clauses
- Broad intellectual property assignment clauses
- Unilateral contract modification rights
- Auto-renewal and cancellation penalty clauses
- One-sided arbitration and dispute resolution clauses
- Limitation of liability and indemnification clauses
- Excessive data collection and sharing clauses
- Termination without cause clauses
- Wage deduction or clawback clauses
- Jurisdiction and governing law clauses (unfavorable)
- Broad confidentiality obligations
- Ambiguous or undefined terms
`;

export const maxDuration = 60; // Allow more time for AI to respond on Vercel

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "This doesn't appear to be a legal document. Please upload a contract or agreement." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
       return NextResponse.json(
        { error: "Groq API key is not configured." },
        { status: 500 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user", 
          content: text
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const parsedData = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(parsedData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Analysis API error:", errorMessage);
    console.error("Full error object:", error);
    return NextResponse.json(
      { error: `Failed to analyze document. Details: ${errorMessage}` },
      { status: 500 }
    );
  }
}
