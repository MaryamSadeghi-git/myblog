import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "هیچ فایلی ارسال نشده است." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let markdown = "";

    if (fileName.endsWith(".md") || fileName.endsWith(".txt")) {
      markdown = buffer.toString("utf-8");
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.convertToHtml({ buffer });
      markdown = turndownService.turndown(result.value);
    } else if (fileName.endsWith(".pdf")) {
      // ایمپورت داینامیک برای جلوگیری از ارورهای بیلد Turbopack
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      markdown = data.text;
    } else {
      return NextResponse.json(
        { error: "فرمت فایل پشتیبانی نمی‌شود (فقط .md, .txt, .docx, .pdf)." },
        { status: 400 }
      );
    }

    // بازگرداندن پاسخ حتماً با NextResponse.json
    return NextResponse.json({ markdown });
  } catch (error: any) {
    console.error("API Convert Error:", error);
    return NextResponse.json(
      { error: error?.message || "خطایی در پردازش و تبدیل فایل رخ داد." },
      { status: 500 }
    );
  }
}
