const documents = [];
const API_BASE = 'https://document-base.onrender.com')

document.getElementById('documentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const documentCode = document.getElementById('document_code').value;
    const signingDate = document.getElementById('signing_date').value;
    const changeHistory = document.getElementById('change_history').value;
    const downloadLink = document.getElementById('download_link').value;

    fetch('${API_BASE}/add_document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            document_code: documentCode,
            signing_date: signingDate,
            change_history: changeHistory,
            download_link: downloadLink
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetchDocuments();
        this.reset();
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
});

function fetchDocuments() {
    fetch('${API_BASE}/documents')
        .then(response => response.json())
        .then(data => {
            documents.length = 0;
            data.forEach(doc => {
                documents.push({
                    code: doc.document_code,
                    date: doc.signing_date,
                    history: doc.change_history,
                    link: doc.download_link
                });
            });
            displayDocuments();
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

function displayDocuments() {
    const tableBody = document.querySelector('#documentsList tbody');
    tableBody.innerHTML = '';
    documents.forEach((doc, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.code}</td>
            <td>${doc.date}</td>
            <td>${doc.history}</td>
            <td><a href="${doc.link}" target="_blank">${doc.link}</a></td>
            <td><button onclick="deleteDocument(${index})">Удалить</button></td>
        `;
        tableBody.appendChild(row); // Добавление строки в таблицу
    });
}

function deleteDocument(index) {
    fetch(`${API_BASE}/delete_document/${documents[index].code}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            documents.splice(index, 1);
            displayDocuments();
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

function searchDocuments() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredDocuments = documents.filter(doc => 
        doc.code.toLowerCase().includes(searchValue) ||
        doc.history.toLowerCase().includes(searchValue)
    );
    displayFilteredDocuments(filteredDocuments);
}

function displayFilteredDocuments(filteredDocuments) {
    const tableBody = document.querySelector('#documentsList tbody');
    tableBody.innerHTML = '';
    filteredDocuments.forEach((doc, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.code}</td>
            <td>${doc.date}</td>
            <td>${doc.history}</td>
            <td><a href="${doc.link}" target="_blank">${doc.link}</a></td>
            <td><button onclick="deleteDocument(${index})">Удалить</button></td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', fetchDocuments);
