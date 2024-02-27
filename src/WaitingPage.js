import React, { useState, useEffect } from 'react';

const WaitingPage = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate progress
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                const newProgress = oldProgress + 10;
                if (newProgress === 100) {
                    clearInterval(timer);
                    // Optionally navigate to a new page or display results here
                }
                return newProgress;
            });
        }, 1000); // Update progress every 1 second

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div>
            <h2>Translating...</h2>
            <div style={{ width: '100%', backgroundColor: '#ddd' }}>
                <div style={{ height: '24px', width: `${progress}%`, backgroundColor: 'blue' }}></div>
            </div>
            <p>{progress}%</p>
        </div>
    );
};

export default WaitingPage;
