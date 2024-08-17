import React from 'react';
import { useNavigate } from 'react-router-dom';

function TranslateButton({ disabled, sourceLanguage, targetLanguage, parsedSubtitles, fileName }) {
    const navigate = useNavigate();

    const handleTranslateClick = async () => {
        navigate('/waiting', { state: { parsedSubtitles, sourceLanguage, targetLanguage, fileName } });
    };

    return (
        <button className="translate-button" onClick={handleTranslateClick} disabled={disabled}>
            Translate Subtitles
        </button>
    );
}

export default TranslateButton;
