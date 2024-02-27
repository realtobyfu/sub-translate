import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import WaitingPage from './WaitingPage';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import TranslateButton from './TranslateButton';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [sourceLanguage, setSourceLanguage] = useState('auto'); // Default to auto-detect
  const [targetLanguage, setTargetLanguage] = useState('en'); // Default target language

  const languages = [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    // Add more languages as needed

  ];

  // Updated to remove direct usage of useHistory here
  const handleTranslateClick = async () => {
    const requestBody = {
      text: "parsedSubtitles", // Placeholder, replace with actual subtitle parsing
      srcLang: sourceLanguage,
      destLang: targetLanguage,
    };

    // Assuming you call an API here and then navigate to /waiting
    // Navigation to /waiting is now handled in TranslateButton component
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file);
      setUploadedFile(file);
      setFileName(file.name);
    }
  };

  return (
      <Router>
        <div className="App">
          <header className="App-header">
            {/* Your existing content */}
            <div className="header-content">
              <h1> Translate Your Subtitle Here!</h1>
              <FontAwesomeIcon icon={faLanguage} size="3x" className="App-logo" />
            </div>
            <p className="description"> <em>Sub-translate</em> is a simple tool that can translate your subtitle files effortlessly.</p>

            {/* File upload and language selection UI */}
            <div className="file-upload-wrapper">
              <button type="button" className="file-upload-btn" onClick={() => document.getElementById('fileInput').click()}>
                Select File
              </button>
              <span className="file-name">{fileName}</span>
              <input id="fileInput" type="file" onChange={handleFileUpload} accept=".srt, .vtt" style={{display: 'none'}} />
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
                  {languages.filter(lang => lang.code !== 'auto').map((lang) => ( // Exclude auto-detect for target
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="translate-button-container">

              <TranslateButton disabled={!uploadedFile} />
            </div>
          </header>

          {/* Define Routes for navigation */}
          <Routes>
            <Route path="/waiting" element={<WaitingPage />} />
            {/* Define more routes as needed */}
          </Routes>
        </div>
      </Router>
  );
}

export default App;