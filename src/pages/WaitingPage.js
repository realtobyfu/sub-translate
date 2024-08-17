import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const WaitingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { parsedSubtitles, sourceLanguage, targetLanguage, fileName } = location.state || {};

    const [progress, setProgress] = useState(0);
    const [translatedLines, setTranslatedLines] = useState([]);
    const [downloadReady, setDownloadReady] = useState(false);
    const [isStopped, setIsStopped] = useState(false); // New state to handle stop logic

    useEffect(() => {
        if (!parsedSubtitles || isStopped) {
            navigate('/');
            return;
        }

        const controller = new AbortController(); // Create an AbortController instance
        const signal = controller.signal; // Extract the signal from the controller

        const translateSubtitles = async () => {
            const lines = parsedSubtitles.split('\n');
            const totalLines = lines.length;

            for (const [index, line] of lines.entries()) {
                if (signal.aborted) break; // Check if the signal is aborted
                await translateLine(line, index, totalLines, signal);
            }
        };

        const translateLine = async (line, index, totalLines, signal) => {
            const requestBody = {
                line,
                srcLang: sourceLanguage,
                destLang: targetLanguage,
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/translate_line', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                    signal: signal, // Attach the signal to the fetch request
                });

                if (response.ok && !signal.aborted) {
                    const data = await response.json();
                    setTranslatedLines((prev) => [...prev, data.translatedLine]);

                    // Update progress
                    setProgress(((index + 1) / totalLines) * 100);

                    // Check if all lines are translated
                    if (index + 1 === totalLines) {
                        setDownloadReady(true);
                    }

                    console.log('response data: ', data);
                } else if (!signal.aborted) {
                    console.error('Error:', await response.text());
                }
            } catch (error) {
                if (!signal.aborted) {
                    console.error('Fetch Error:', error);
                }
            }
        };

        translateSubtitles();

        // Cleanup function to abort ongoing requests
        return () => {
            controller.abort(); // Abort the ongoing requests
            setProgress(0);
            setTranslatedLines([]);
            setDownloadReady(false);
        };
    }, [parsedSubtitles, sourceLanguage, targetLanguage, navigate, isStopped]);

    const handleStopClick = () => {
        setIsStopped(true);
        navigate('/');
    };

    const downloadTranslatedFile = () => {
        const element = document.createElement('a');
        const fileContent = translatedLines.join('\n');
        const file = new Blob([fileContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileName.replace(/\.\w+$/, '_translated.srt'); // Replace original extension with _translated.srt
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div>
            <h2>Translating...</h2>
            <div style={{ width: '100%', backgroundColor: '#ddd' }}>
                <div style={{ height: '24px', width: `${progress}%`, backgroundColor: 'blue' }}></div>
            </div>
            <p>{progress.toFixed(2)}%</p>
            <button onClick={handleStopClick} style={{ marginTop: '20px' }}>
                Stop
            </button>
            {downloadReady && (
                <button onClick={downloadTranslatedFile} style={{ marginTop: '20px' }}>
                    Download Translated File
                </button>
            )}
        </div>
    );
};

export default WaitingPage;
