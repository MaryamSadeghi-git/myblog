import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // این خط مسیرهای api، فایل‌های استاتیک و keystatic را از تغییر مسیر معاف می‌کند
  matcher: ['/((?!api|_next|_vercel|keystatic|.*\\..*).*)']
};
