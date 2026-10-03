import { translate } from '@vitalets/google-translate-api';

export async function faToEn(text: string): Promise<string> {
  if (!text || typeof text !== 'string' || !text.trim()) return text;

  try {
    const res = await translate(text, { from: 'fa', to: 'en' });
    return res.text;
  } catch (e) {
    console.error('faToEn error:', e);
    return text;
  }
}

