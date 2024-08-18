import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WaitingPage from './pages/WaitingPage';
import MainPage from './pages/MainPage';

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
                                    languages={languages}
                                    setSourceLanguage={setSourceLanguage}
                                    setTargetLanguage={setTargetLanguage}
                                    setUploadedFile={setUploadedFile}
                                    setFileName={setFileName}
                                    parsedSubtitles={parsedSubtitles}
                                    setParsedSubtitles={setParsedSubtitles}
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
