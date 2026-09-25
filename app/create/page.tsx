// app/create/page.tsx
"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ارسال فایل به API تبدیل
  const uploadAndConvertFile = async (file: File) => {
    setError(null);
    setIsConverting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در تبدیل فایل");
      }

      // تنظیم عنوان پیش‌فرض بر اساس اسم فایل (در صورت خالی بودن)
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(cleanName);
        setSlug(cleanName.toLowerCase().replace(/[^a-z0-9آ-ی]/gi, "-"));
      }

      // درج مارک‌داون داخل متن ادیتور
      setContent((prev) => (prev ? `${prev}\n\n${data.markdown}` : data.markdown));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  };

  // رویدادهای درگ و دراپ
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadAndConvertFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAndConvertFile(e.target.files[0]);
    }
  };

  // ذخیره پست
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/posts/${data.post.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">ایجاد مقاله جدید</h1>
        <p className="text-sm text-slate-400">
          می‌توانید مقاله را بنویسید یا یک فایل متنی/ورد/پی‌دی‌اف درگ کنید تا خودکار تبدیل شود.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* بخش Drag & Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/20 scale-[1.01]"
            : "border-slate-800 hover:border-slate-700 bg-[#0d121e]/50 hover:bg-[#0d121e]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".docx,.pdf,.md,.txt"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 text-xl">
            {isConverting ? "⏳" : "📁"}
          </div>
          <div>
            <p className="text-white font-semibold mb-1">
              {isConverting
                ? "در حال تبدیل فایل به مارک‌داون..."
                : "فایل خود را اینجا رها کنید، یا کلیک کنید"}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              پشتیبانی از فرمت‌های docx, .pdf, .md, .txt.
            </p>
          </div>
        </div>
      </div>

      {/* فرم ویرایش */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">عنوان مقاله</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: آموزش جامع Next.js"
              className="w-full bg-[#0d121e] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">اسلاگ (Slug - آدرس URL)</label>
            <input
              type="text"
              required
              dir="ltr"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="learn-nextjs"
              className="w-full bg-[#0d121e] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">محتوای مارک‌داون</label>
          <textarea
            required
            rows={14}
            dir="auto"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# شروع به نوشتن کنید یا فایل درگ کنید..."
            className="w-full bg-[#0d121e] border border-slate-800 rounded-2xl p-4 text-slate-200 font-mono text-sm leading-relaxed focus:outline-none focus:border-cyan-500/50 resize-y"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting || isConverting}
            className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            {isSubmitting ? "در حال ذخیره..." : "انتشار مقاله"}
          </button>
        </div>
      </form>
    </div>
  );
}
