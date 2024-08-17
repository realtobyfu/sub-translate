import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WaitingPage from 'pages/WaitingPage';
import MainPage from 'pages/MainPage';
import SubtitlesParser from 'subtitles-parser';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [parsedSubtitles, setParsedSubtitles] = useState('');

  const languages = [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
  ];

  /* use this to clear the cache persisted */
  useEffect(() => {
    // Clear persisted data on page refresh
    window.onbeforeunload = () => {
      setUploadedFile(null);
      setFileName('No file chosen');
      setParsedSubtitles('');
      setSourceLanguage('auto');
      setTargetLanguage('en');
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsed = SubtitlesParser.fromSrt(content, true);
        const text = parsed.map((item) => item.text).join(' ');
        setParsedSubtitles(text);
        setUploadedFile(file);
      };
      reader.readAsText(file);
    }
  };

  return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route
                  path="/"
                  element={
                    <MainPage
                        uploadedFile={uploadedFile}
                        fileName={fileName}
                        sourceLanguage={sourceLanguage}
                        targetLanguage={targetLanguage}
                        parsedSubtitles={parsedSubtitles}
                        handleFileUpload={handleFileUpload}
                        languages={languages}
                        setSourceLanguage={setSourceLanguage}
                        setTargetLanguage={setTargetLanguage}
                    />
                  }
              />
              <Route path="/waiting" element={<WaitingPage />} />
            </Routes>
          </header>
        </div>
      </Router>
  );
}

export default App;
