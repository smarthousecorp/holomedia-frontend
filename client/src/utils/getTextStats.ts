export const getTextStats = (htmlString: string) => {
  if (!htmlString)
    return {
      textLength: 0,
      textContent: "",
      withoutSpaces: 0,
    };

  // 임시 div 엘리먼트 생성
  const div = document.createElement("div");
  div.innerHTML = htmlString;

  // 순수 텍스트 추출 (줄바꿈 유지)
  const textContent = div.textContent || div.innerText || "";

  // 실제 텍스트 길이 (공백 포함)
  const textLength = textContent.length;

  // 공백을 제외한 텍스트 길이
  const withoutSpaces = textContent.replace(/\s+/g, "").length;

  return {
    textLength, // 공백 포함 길이
    textContent, // 추출된 순수 텍스트
    withoutSpaces, // 공백 제외 길이
  };
};
