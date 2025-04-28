import i18n from "../i18n";

interface TranslationCache {
  value: string;
  timestamp: number;
}

class TranslationService {
  private readonly DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간
  private memoryCache: Map<string, string> = new Map();

  async translate(text: string, targetLang: string): Promise<string> {
    // 빈 문자열이나 공백만 있는 경우 처리
    if (!text.trim()) return text;

    // 캐시 확인
    const cacheKey = this.generateCacheKey(text, targetLang);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${this.DEEPL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const translatedText = data.translations[0].text;

      // 캐시 저장
      this.saveToCache(cacheKey, translatedText);

      return translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // 번역 실패 시 원본 텍스트 반환
    }
  }

  private generateCacheKey(text: string, targetLang: string): string {
    return `${text}-${targetLang}`;
  }

  private getFromCache(key: string): string | null {
    // 메모리 캐시 확인
    const memoryCached = this.memoryCache.get(key);
    if (memoryCached) return memoryCached;

    // 로컬 스토리지 캐시 확인
    try {
      const cached = localStorage.getItem(`translation_${key}`);
      if (!cached) return null;

      const { value, timestamp }: TranslationCache = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_TTL) {
        localStorage.removeItem(`translation_${key}`);
        return null;
      }

      // 메모리 캐시에 저장
      this.memoryCache.set(key, value);
      return value;
    } catch (error) {
      console.error("Failed to load from cache:", error);
      return null;
    }
  }

  private saveToCache(key: string, value: string): void {
    // 메모리 캐시 저장
    this.memoryCache.set(key, value);

    // 로컬 스토리지 캐시 저장
    try {
      const cacheData: TranslationCache = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(`translation_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Failed to save to cache:", error);
    }
  }

  // 캐시 초기화 (필요시)
  clearCache(): void {
    this.memoryCache.clear();
    // 로컬 스토리지에서 번역 관련 캐시만 삭제
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("translation_")) {
        localStorage.removeItem(key);
      }
    });
  }
}

// 싱글톤 인스턴스 생성
export const translationService = new TranslationService();

// React 훅
export const useTranslation = () => {
  const translate = async (
    text: string,
    targetLang: string = i18n.language
  ) => {
    return await translationService.translate(text, targetLang);
  };

  return { translate };
};
