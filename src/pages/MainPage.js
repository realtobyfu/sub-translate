import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import TranslateButton from '../components/TranslateButton';

function MainPage({
                      uploadedFile,
                      fileName,
                      sourceLanguage,
                      targetLanguage,
                      parsedSubtitles,
                      handleFileUpload,
                      languages,
                      setSourceLanguage,
                      setTargetLanguage,
                  }) {
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
