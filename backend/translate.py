from flask import Flask, request, jsonify
from googletrans import Translator

app = Flask(__name__)

@app.route('/translate', methods=['POST'])
def translate_tet():
    data = request.json
    translator = Translator()
    translated = translator.translate(data['text'], src=data['srcLang'], dest=data['destLang'])
    return jsonify(translated.text)

if __name__ == '__main__':
    app.run(debug=True)