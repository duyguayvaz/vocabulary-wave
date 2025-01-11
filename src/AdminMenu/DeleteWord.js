import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, Table, InputGroup, FormControl } from 'react-bootstrap';

function DeleteWord() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  // Kelime arama
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 1) {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/words?filters[word][$contains]=${term}`
        );
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Arama hatası:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Silinecek kelimeyi seç
  const handleSelectWord = (word) => {
    if (!word) {
      alert('Geçersiz kelime verisi!');
      return;
    }

    setSelectedWord(word);
  };

  // Silme işlemi
  const handleDelete = async () => {
    if (!selectedWord || !selectedWord.documentId) {
      alert('Silmek için geçerli bir kelime seçmelisiniz!');
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:1337/api/words/${selectedWord.documentId}`
      );

        alert('Kelime Silindi');
        setSearchResults(searchResults.filter((item) => item.id !== selectedWord.id)); // Listeyi güncelle
        setSearchTerm('');
        setSelectedWord(null);

    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Kelime Silinemedi');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Kelime Sil</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Kelime ara"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      {/* Arama Sonuçları */}
      {searchResults.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Word</th>
              <th>Word (TR)</th>
              <th>Document ID</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result) => (
              <tr key={result.id}>
                <td>{result.word || 'Kelime Bulunamadı'}</td>
                <td>{result.word_tr || 'Türkçe Karşılık Bulunamadı'}</td>
                <td>{result.documentId || 'Document ID Bulunamadı'}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleSelectWord(result)}
                  >
                    Seç
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Silme Butonu */}
      {selectedWord && (
        <div className="mt-3">
          <p>Seçilen Kelime: {selectedWord.word}</p>
          <Button variant="danger" onClick={handleDelete}>
            Kelimeyi Sil
          </Button>
        </div>
      )}
    </Container>
  );
}

export default DeleteWord;
