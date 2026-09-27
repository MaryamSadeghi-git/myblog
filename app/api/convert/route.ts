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
        { error: "فایلی دریافت نشد." },
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
      try {
        // dynamic require برای جلوگیری از ارورهای بیلد Turbopack
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(buffer);
        markdown = data.text || "";
      } catch (pdfErr: any) {
        console.error("PDF Parsing Error:", pdfErr);
        return NextResponse.json(
          { error: "خطا در خواندن فایل PDF. لطفاً فایل DOCX یا Markdown آپلود کنید." },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "فرمت پشتیبانی نمی‌شود. لطفاً فایل md، txt، docx یا pdf ارسال کنید." },
        { status: 400 }
      );
    }

    return NextResponse.json({ markdown });
  } catch (error: any) {
    console.error("API Convert Error:", error);
    return NextResponse.json(
      { error: error?.message || "خطای ناشناخته در پردازش فایل." },
      { status: 500 }
    );
  }
}
