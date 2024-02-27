import React from 'react';
import { useNavigate } from 'react-router-dom';

function TranslateButton({ disabled, sourceLanguage, targetLanguage }) {
    const navigate = useNavigate();

    const handleTranslateClick = async () => {
        const requestBody = {
            text: "parsedSubtitles", // Placeholder, replace with actual subtitle parsing
            srcLang: sourceLanguage,
            destLang: targetLanguage,
        };
        // Assuming you call an API here and then navigate to /waiting
    };

    return (
        <button className="translate-button" onClick={handleTranslateClick} disabled={disabled}>
            Translate Subtitles
        </button>
    );
}
export default TranslateButton;