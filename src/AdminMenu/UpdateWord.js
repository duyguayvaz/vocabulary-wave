import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, Table, InputGroup, FormControl } from 'react-bootstrap';

function UpdateWord() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [word, setWord] = useState('');
  const [word_tr, setWordTr] = useState('');

  // Kelime arama
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 1) {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/words?filters[word][$contains]=${term}`
        );
        setSearchResults(response.data.data); // Gelen data içinde sonuçları işliyoruz
      } catch (error) {
        console.error('Arama hatası:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Güncellenecek kelimeyi seç
  const handleSelectWord = (word) => {
    if (!word) {
      alert('Geçersiz kelime verisi!');
      return;
    }

    setSelectedWord(word);
    setWord(word.word || '');
    setWordTr(word.word_tr || '');
  };

  // Güncelleme işlemi
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedWord || !selectedWord.documentId) {
      alert('Güncellemek için geçerli bir kelime seçmelisiniz!');
      return;
    }

    const updatedWordData = {
      data: {
        word,
        word_tr,
      },
    };

    try {
      const response = await axios.put(
        `http://localhost:1337/api/words/${selectedWord.documentId}`,
        updatedWordData
      );

      if (response.status === 200) {
        alert('Kelime Güncellendi');
        setSearchResults([]); // Güncellemeden sonra listeyi temizle
        setSearchTerm('');
        setSelectedWord(null);
      } else {
        alert('Kelime Güncellenemedi');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('Kelime Güncellenemedi');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Kelime Güncelle</h2>
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
              <th>Güncelle</th>
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
                    variant="primary"
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

      {/* Güncelleme Formu */}
      {selectedWord && (
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3" controlId="formWord">
            <Form.Label>Kelime (Word)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Kelimeyi güncelle"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formWordTr">
            <Form.Label>Kelime (Türkçe)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Türkçe karşılığını güncelle"
              value={word_tr}
              onChange={(e) => setWordTr(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Güncelle
          </Button>
        </Form>
      )}
    </Container>
  );
}

export default UpdateWord;
