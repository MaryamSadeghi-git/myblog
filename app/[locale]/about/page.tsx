// app/[locale]/about/page.tsx
import { Link } from '@/i18n/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const skills = [
    'Next.js / React',
    'TypeScript',
    'Tailwind CSS',
    'Python & Data Science',
    'Flutter & Dart',
    'Git / GitHub',
  ];

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* دکمه بازگشت */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-accent-orange transition-colors flex items-center gap-1.5 group"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
            {isFa ? '→' : '←'}
          </span>
          <span>{isFa ? 'بازگشت به خانه' : 'Back to Home'}</span>
        </Link>
      </div>

      {/* باکس هدر پروفایل */}
      <section className="relative overflow-hidden rounded-3xl bg-bg-card border border-border-subtle p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 right-1/4 w-72 h-40 bg-accent-orange/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* آواتار یا تصویر پروفایل */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-bg-main border-2 border-accent-orange/50 overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-accent-orange/10">
            <span className="text-3xl font-black text-accent-orange">
              {isFa ? 'وبلاگ' : 'DEV'}
            </span>
          </div>

          <div className="text-center sm:text-right rtl:sm:text-right ltr:sm:text-left flex-1 space-y-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent-orange/10 text-accent-orange border border-accent-orange/20 inline-block">
              {isFa ? 'درباره نویسنده' : 'About the Author'}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {isFa ? 'سلام، من اینجا می‌نویسم' : "Hi, I'm writing here"}
            </h1>

            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              {isFa
                ? 'علاقه‌مند به توسعه وب، تحلیل داده و یادگیری فناوری‌های مدرن. در این وبلاگ تجربیات، آموزش‌ها و چالش‌های مسیر یادگیری‌ام را مستند می‌کنم.'
                : 'Passionate about web development, data science, and modern technologies. Here I document my learning journey, code snippets, and technical thoughts.'}
            </p>
          </div>
        </div>
      </section>

      {/* مهارت‌ها و علاقه‌مندی‌ها */}
      <section className="rounded-2xl bg-bg-card border border-border-subtle p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-orange" />
          <h2 className="text-xl font-bold text-white">
            {isFa ? 'حوزه‌ها و مهارت‌ها' : 'Skills & Technologies'}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-1.5 rounded-xl bg-bg-main border border-border-subtle text-text-main text-xs sm:text-sm hover:border-accent-orange/50 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* راه‌های ارتباطی */}
      <section className="rounded-2xl bg-bg-card border border-border-subtle p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-orange" />
          <h2 className="text-xl font-bold text-white">
            {isFa ? 'ارتباط با من' : 'Get in Touch'}
          </h2>
        </div>

        <p className="text-text-muted text-sm leading-relaxed">
          {isFa
            ? 'اگر سوالی درباره پست‌ها دارید یا می‌خواهید با هم در ارتباط باشیم، از طریق لینک‌های زیر یا بخش نظرات هر پست پیام بگذارید.'
            : 'Feel free to reach out via GitHub or through the comments section on posts.'}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-xl bg-accent-orange hover:bg-accent-orange-hover text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-accent-orange/20 hover:-translate-y-0.5"
          >
            GitHub
          </a>
          <Link
            href="/archive"
            className="px-5 py-2 rounded-xl bg-bg-main hover:bg-bg-card-hover text-text-main hover:text-accent-orange border border-border-subtle hover:border-accent-orange/40 text-xs sm:text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
          >
            {isFa ? 'مشاهده آرشیو مقالات' : 'Browse Archive'}
          </Link>
        </div>
      </section>
    </main>
  );
}
