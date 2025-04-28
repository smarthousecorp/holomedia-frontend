import React, { useEffect, useState } from "react";
import { useTranslation } from "../../utils/translation_deepl";

interface TranslatedTextProps {
  text: string;
  targetLang?: string;
  className?: string;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  targetLang,
  className,
}) => {
  const { translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (text) {
        const result = await translate(text, targetLang);
        setTranslatedText(result);
      }
    };

    fetchTranslation();
  }, [text, targetLang, translate]);

  return <span className={className}>{translatedText}</span>;
};

export default TranslatedText;
