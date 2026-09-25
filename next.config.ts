import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // فعال‌سازی پسوندهای md و mdx برای صفحات
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  /* سایر تنظیمات اختیاری شما در اینجا قرار می‌گیرند */
};

const withMDX = createMDX({
  // پلاگین‌های اختیاری در صورت نیاز اینجا اضافه می‌شوند
});

export default withMDX(nextConfig);
