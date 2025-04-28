import i18n from "../i18n";

interface TranslationCache {
  value: string;
  timestamp: number;
}

// 간단한 해시 함수
const generateHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

class TranslationService {
  private readonly GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간
  private memoryCache: Map<string, string> = new Map();

  async translate(text: string, targetLang: string): Promise<string> {
    // 빈 문자열이나 공백만 있는 경우 처리
    if (!text.trim()) return text;

    // 캐시 확인
    const cacheKey = this.generateCacheKey(text, targetLang);
    console.log("캐시 키:", cacheKey);

    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log("캐시 히트:", { text, targetLang });
      return cached;
    }

    try {
      console.log("Google Translation API 호출:", {
        text,
        targetLang,
        apiKey: this.GOOGLE_API_KEY,
      });

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            target: targetLang,
            format: "text",
          }),
        }
      );

      console.log("API 응답 상태:", response.status);
      const responseText = await response.text();
      console.log("API 응답 내용:", responseText);

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      const translatedText = data.data.translations[0].translatedText;

      // 캐시 저장
      this.saveToCache(cacheKey, translatedText);
      console.log("캐시 저장 완료:", { text, targetLang, translatedText });

      return translatedText;
    } catch (error) {
      console.error("Translation failed:", error);
      return text; // 번역 실패 시 원본 텍스트 반환
    }
  }

  // 배치 번역 메서드 추가
  async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts.length) return [];

    try {
      console.log("Google Translation API 배치 호출:", {
        texts,
        targetLang,
        apiKey: this.GOOGLE_API_KEY,
      });

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: texts,
            target: targetLang,
            format: "text",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Batch translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const translations = data.data.translations.map(
        (t: any) => t.translatedText
      );

      // 캐시 저장
      texts.forEach((text, index) => {
        const cacheKey = this.generateCacheKey(text, targetLang);
        this.saveToCache(cacheKey, translations[index]);
      });

      return translations;
    } catch (error) {
      console.error("Batch translation failed:", error);
      return texts; // 번역 실패 시 원본 텍스트 반환
    }
  }

  private generateCacheKey(text: string, targetLang: string): string {
    // 텍스트의 해시값과 언어 코드를 조합하여 캐시 키 생성
    const textHash = generateHash(text.trim());
    return `translation_${textHash}_${targetLang}`;
  }

  private getFromCache(key: string): string | null {
    // 메모리 캐시 확인
    const memoryCached = this.memoryCache.get(key);
    if (memoryCached) {
      console.log("메모리 캐시 히트:", key);
      return memoryCached;
    }

    // 로컬 스토리지 캐시 확인
    try {
      const cached = localStorage.getItem(key);
      if (!cached) {
        console.log("캐시 미스:", key);
        return null;
      }

      const { value, timestamp }: TranslationCache = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_TTL) {
        console.log("캐시 만료:", key);
        localStorage.removeItem(key);
        return null;
      }

      // 메모리 캐시에 저장
      this.memoryCache.set(key, value);
      console.log("로컬 스토리지 캐시 히트:", key);
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
      localStorage.setItem(key, JSON.stringify(cacheData));
      console.log("캐시 저장 성공:", key);
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

  const translateBatch = async (
    texts: string[],
    targetLang: string = i18n.language
  ) => {
    return await translationService.translateBatch(texts, targetLang);
  };

  return { translate, translateBatch };
};
