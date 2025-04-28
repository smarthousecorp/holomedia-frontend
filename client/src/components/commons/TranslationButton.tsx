import React, { useState } from "react";
import { useTranslation } from "../../utils/translation_deepl";
import { Button } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";

interface TranslationButtonProps {
  text: string;
  targetLang?: string;
  onTranslate?: (translatedText: string) => void;
  className?: string;
}

const TranslationButton: React.FC<TranslationButtonProps> = ({
  text,
  targetLang,
  onTranslate,
  className,
}) => {
  const { translate } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;

    setIsTranslating(true);
    try {
      const translatedText = await translate(text, targetLang);
      if (onTranslate) {
        onTranslate(translatedText);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<TranslateIcon />}
      onClick={handleTranslate}
      disabled={isTranslating || !text}
      className={className}
    >
      {isTranslating ? "번역 중..." : "번역하기"}
    </Button>
  );
};

export default TranslationButton;
