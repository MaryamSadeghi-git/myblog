// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import HeroHeader from '@/components/HeroHeader';
import 'highlight.js/styles/atom-one-dark.css';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const isFa = locale === 'fa';

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={dir} className="min-h-screen w-full bg-bg-main text-text-main">
        {/* هدر شناور */}
        <HeroHeader locale={locale} />

        {/* 
          فاصله از بالا برای موبایل (pt-24 یا pt-28 متناسب با هدر موبایل)
          فاصله از راست در فارسی دسکتاپ (md:pr-72 یا md:pr-80)
          فاصله از چپ در انگلیسی دسکتاپ (md:pl-72 یا md:pl-80)
        */}
        <main
          className={`w-full min-w-0 pt-24 md:pt-8 transition-all duration-300 ${
            isFa ? 'md:pr-80 md:pl-8' : 'md:pl-80 md:pr-8'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            {children}
          </div>
        </main>
      </div>
    </NextIntlClientProvider>
  );
}

