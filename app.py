from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('documentationbase.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_document', methods=['POST'])
def add_document():
    data = request.json
    document_code = data['document_code']
    signing_date = data['signing_date']
    change_history = data['change_history']
    download_link = data['download_link']

    with get_db_connection() as conn:
        conn.execute('''
            INSERT INTO Documentation (document_code, signing_date, change_history, download_link)
            VALUES (?, ?, ?, ?)
        ''', (document_code, signing_date, change_history, download_link))
        conn.commit()

    return jsonify({'message': 'Документ добавлен!'}), 201

# Эндпоинт для получения всех документов
@app.route('/documents', methods=['GET'])
def get_documents():
    with get_db_connection() as conn:
        documents = conn.execute('SELECT * FROM Documentation').fetchall()
    return jsonify([dict(doc) for doc in documents])

if __name__ == '__main__':
    app.run(debug=True)
