from flask import Flask, request, jsonify
from googletrans import Translator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for all origins and all routes

translator = Translator()

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text', '')
    src_lang = data.get('srcLang', 'auto')
    dest_lang = data.get('destLang', 'en')

    try:
        translated = translator.translate(text, src=src_lang, dest=dest_lang)
        return jsonify({'translatedText': translated.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/translate_line', methods=['POST'])
def translate_line():
    data = request.json
    line = data.get('line', '')
    src_lang = data.get('srcLang', 'auto')
    dest_lang = data.get('destLang', 'en')

    try:
        translated = translator.translate(line, src=src_lang, dest=dest_lang)

        return jsonify({'translatedLine': translated.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
