const express = require('express');
const translatte = require('translatte');
const cors = require('cors');

const app = express();
const port = 3001; // Ensure this port does not conflict with your React app

app.use(express.json());
app.use(cors()); // Use CORS to allow requests from your React app's domain

// Translation endpoint
app.post('/translate', async (req, res) => {
    const { text, srcLang, destLang } = req.body;
    try {
        const result = await translatte(text, { from: srcLang, to: destLang });
        res.json({ translatedText: result.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
