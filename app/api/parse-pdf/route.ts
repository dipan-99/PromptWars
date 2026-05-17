import { NextRequest, NextResponse } from "next/server";

// Dynamic import or require inside function to avoid ESM issues with pdf-parse
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Require inside the function for CJS compatibility
    const pdfParse = require("pdf-parse");
    const pdfData = await pdfParse(buffer);

    return NextResponse.json({ text: pdfData.text });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF file" },
      { status: 500 }
    );
  }
}
