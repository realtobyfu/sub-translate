import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const WaitingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { parsedSubtitles, sourceLanguage, targetLanguage, fileName } = location.state || {};
    const [translatedSubtitles, setTranslatedSubtitles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isStopped, setIsStopped] = useState(false);

    useEffect(() => {
        if (!parsedSubtitles || isStopped) {
            navigate('/');
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const translateSubtitles = async () => {
            const translatedSegments = [];
            for (let i = 0; i < parsedSubtitles.length; i++) {
                const segment = parsedSubtitles[i];

                if (signal.aborted) break;
                const translatedLine = await translateLine(segment.text, sourceLanguage, targetLanguage);

                translatedSegments.push({
                    index: segment.index,
                    timestamp: segment.timestamp,
                    combined: segment.combined,
                    text: translatedLine
                });

                setProgress(((i + 1) / parsedSubtitles.length) * 100);
            }
            setTranslatedSubtitles(translatedSegments);
        };

        translateSubtitles();

        // console.log("translated", translatedSubtitles)

        return () => {
            controller.abort();
            setProgress(0);
            setTranslatedSubtitles([]);
        };
    }, [parsedSubtitles, sourceLanguage, targetLanguage, navigate, isStopped]);

    const translateLine = async (text, srcLang, destLang) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/translate_line', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    line: text,
                    srcLang,
                    destLang,
                }),
            });

            const data = await response.json();
            console.log(data)
            return response.ok ? data.translatedLine : text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    };

    const downloadTranslatedFile = () => {
        const srtContent = translatedSubtitles.map(segment => {
            let text;

            if (segment.combined) {
                const splitText = splitIntoEvenLines(segment.text);
                text = `${splitText[0]}\n${splitText[1]}`; // Ensure split lines are separated correctly
            } else {
                text = segment.text; // Use the original translated text if not combined
            }

            return `${segment.index}\n${segment.timestamp}\n${text}`; // Properly format each segment
        }).join('\n\n'); // Separate SRT segments by double newlines

        const element = document.createElement('a');
        const file = new Blob([srtContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileName.replace(/\.\w+$/, '_translated.srt');
        document.body.appendChild(element);
        element.click();
    };

    const splitIntoEvenLines = (text) => {
        const words = text.split(' ');
        const midpoint = Math.floor(words.length / 2);
        const firstPart = words.slice(0, midpoint).join(' ');
        const secondPart = words.slice(midpoint).join(' ');

        return [firstPart, secondPart];
    };

    const handleStopClick = () => {
        setIsStopped(true);
        navigate('/');
    };

    return (
        <div>
            <h2>Translating... {progress.toFixed(2)}%</h2>
            <div style={{ width: '100%', backgroundColor: '#ddd' }}>
                <div style={{ height: '24px', width: `${progress}%`, backgroundColor: 'blue' }}></div>
            </div>
            <div className='buttons'>
                {progress === 100 && (
                    <button onClick={downloadTranslatedFile} className="download-button" style={{ marginTop: '20px' }}>
                        Download Translated File
                    </button>
                )}
                <button className={progress === 100 ? "go-back-button" : "abort-button"} onClick={handleStopClick} style={{ marginTop: '20px' }}>
                    {progress === 100 ? "Go Back": "Abort"}
                </button>
            </div>
        </div>
    );
};

export default WaitingPage;
