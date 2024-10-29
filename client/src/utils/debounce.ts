export const debounce = <T extends any[]>(
  func: (...args: T) => void, // 지연시키고자 하는 함수
  delay: number // 호출이 지연될 시간
): ((...args: T) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
};
