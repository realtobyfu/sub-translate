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
    // alternative splitting to make it with larger files
// Function to parse the .srt content into segments
    // Function to parse the .srt content into segments
    const parseSRT = (content) => {
        const lines = content.split(/\r?\n/); // Split by line breaks (handles both Windows and Unix formats)
        const segments = [];
        let currentSegment = {};
        let currentTextLines = [];

        lines.forEach(line => {
            if (/^\d+$/.test(line)) { // Line is an index number
                if (currentSegment.index) {
                    // Push the current segment into the array before starting a new one
                    currentSegment.text = processTextLines(currentTextLines);
                    segments.push(currentSegment);
                    currentTextLines = [];
                }
                // Start a new segment
                currentSegment = {
                    index: line,
                    timestamp: '',
                    combined: false, // Initialize combined as false
                    text: ''
                };
            } else if (/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(line)) { // Line is a timestamp
                currentSegment.timestamp = line;
            } else if (line.trim() === '') { // Empty line indicates the end of a segment
                if (currentSegment.index) {
                    const { text, combined } = processTextLines(currentTextLines); // Get text and combined status

                    if (combined) {
                        console.log("combined is set to true", text, currentSegment.index)
                    }
                    currentSegment.text = text;
                    currentSegment.combined = combined; // Set combined flag
                    segments.push(currentSegment);
                    currentSegment = {};
                    currentTextLines = [];
                }
            } else {
                // It's part of the subtitle text
                currentTextLines.push(line);
            }
        });

        // Push the last segment if there is any
        if (currentSegment.index) {
            const { text, combined } = processTextLines(currentTextLines);
            currentSegment.text = text;
            currentSegment.combined = combined;
            segments.push(currentSegment);
        }

        return segments;
    };

// Helper function to process the text lines of a segment
    const processTextLines = (lines) => {
        let combined = false;
        let text = "";

        if (lines.length > 1) {
            const firstLine = lines[0];
            const secondLine = lines[1];

            // Only combine lines when there's no terminating punctuation and the second line doesn't start with "- " or "—"
            if (!/[.!?]$/.test(firstLine) && !/^-|^—/.test(secondLine)) {
                combined = true;
                text = `${firstLine} ${secondLine}`; // Combine the lines
            } else {
                text = lines.join('\n'); // Keep the lines separate with original line breaks
            }
        } else {
            text = lines.join('\n'); // Single line, return as is
        }

        return { text, combined }; // Return both text and combined flag
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
