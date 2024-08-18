import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import TranslateButton from '../components/TranslateButton';  // Import the TranslateButton component

function MainPage({
                      parsedSubtitles,
                      uploadedFile,
                      fileName,
                      sourceLanguage,
                      targetLanguage,
                      languages,
                      setSourceLanguage,
                      setTargetLanguage,
                      setUploadedFile,
                      setFileName,
                      setParsedSubtitles,  // Receive setParsedSubtitles as a prop
                  }) {
    // const navigate = useNavigate();

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Uploaded file:', file);
            setFileName(file.name);
            setUploadedFile(true);

            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                const parsed = parseSRT(content);
                setParsedSubtitles(parsed);  // Update parsedSubtitles state
                console.log("parsed subtitle:", parsed)
            };
            reader.readAsText(file);
        }
    };

    // Function to parse the .srt content into segments
    const parseSRT = (content) => {
        const segments = content.trim().split('\n\n');
        return segments.map(segment => {
            const lines = segment.split('\n');

            let text = "";
            let combined = false;

            if (lines.length > 3) { // If there are more than 2 lines of text in the subtitle
                const firstLine = lines[2];
                const secondLine = lines[3];

                // Only combine lines when there's no terminating punctuation and the second line doesn't start with "- " or "—"
                if (!/[.!?]$/.test(firstLine) && !/^-|^—/.test(secondLine)) {
                    // Combine the lines
                    text = `${firstLine} ${secondLine}`;
                    combined = true;
                } else {
                    // Keep the lines separate
                    text = `${firstLine}\n${secondLine}`;
                }
            } else {
                text = lines.slice(2).join('\n'); // Use '\n' to keep the original line breaks intact
            }

            return {
                index: lines[0],
                timestamp: lines[1],
                combined: combined,
                text: text // Keep the text as is, with no trimming
            };
        });
    };

    return (
        <>
            <div className="header-content">
                <h1>Translate Your Subtitle Here!</h1>
                <FontAwesomeIcon icon={faLanguage} size="3x" className="App-logo" />
            </div>
            <p className="description">
                <em>Sub-translate</em> is a simple tool that can translate your subtitle files effortlessly.
            </p>

            <div className="file-upload-wrapper">
                <button
                    type="button"
                    className="file-upload-btn"
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    Select File
                </button>
                <span className="file-name">{fileName}</span>
                <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".srt, .vtt"
                    style={{ display: 'none' }}
                />
            </div>
            <div className="App-description">
                Upload your subtitle file and choose your desired translation language. Our tool does the rest. The file needs to be in .srt or .vtt format.
            </div>

            <div className="language-selection-container">
                <div className="source-lang">
                    <label>Source Language: </label>
                    <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="target-lang">
                    <label>Target Language: </label>
                    <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                        {languages
                            .filter((lang) => lang.code !== 'auto')
                            .map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="translate-button-container">
                <TranslateButton
                    disabled={!uploadedFile}
                    sourceLanguage={sourceLanguage}
                    targetLanguage={targetLanguage}
                    parsedSubtitles={parsedSubtitles}
                    fileName={fileName}
                />
            </div>
        </>
    );
}

export default MainPage;
