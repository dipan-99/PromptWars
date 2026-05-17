import mammoth from "mammoth";

export async function parseDocument(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    return await file.text();
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (extension === 'pdf') {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to parse PDF document");
    }

    const data = await response.json();
    return data.text;
  }

  throw new Error("Unsupported file type");
}
