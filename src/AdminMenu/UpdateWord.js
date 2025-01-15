// Kelime güncelleme işlemleri için gerekli kütüphaneleri import ediyoruz.
import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, Table, InputGroup, FormControl } from 'react-bootstrap';

// UpdateWord bileşeni oluşturuyoruz.
function UpdateWord() {
  // Kullanıcının arayacağı kelime, arama sonuçları, seçilen kelime ve güncellenecek değerler için state'leri tanımlıyoruz.
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [word, setWord] = useState('');
  const [word_tr, setWordTr] = useState('');

  // Kullanıcının yazdığı arama terimine göre kelimeyi API'den çekiyoruz.
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // En az 2 karakter girildiğinde arama yapıyoruz.
    if (term.length > 1) {
      try {
        // API isteği yaparak kelimeleri filtreliyoruz.
        const response = await axios.get(
          `http://34.78.14.168:1337/api/words?filters[word][$contains]=${term}`
        );
        // Gelen veriyi arama sonuçlarına kaydediyoruz.
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Arama hatası:', error);
      }
    } else {
      // 2 karakterden azsa sonuçları sıfırlıyoruz.
      setSearchResults([]);
    }
  };

  // Kullanıcı bir kelime seçtiğinde, güncelleme işlemi için gerekli bilgileri dolduruyoruz.
  const handleSelectWord = (word) => {
    // Eğer geçersiz bir kelimeyse uyarı veriyoruz.
    if (!word) {
      alert('Geçersiz kelime verisi!');
      return;
    }
    // Seçilen kelimeyi state'e kaydediyoruz.
    setSelectedWord(word);
    // Form alanlarına seçilen kelime değerlerini koyuyoruz.
    setWord(word.word || '');
    setWordTr(word.word_tr || '');
  };

  // Seçilen kelimeyi güncellemek için API'ye PUT isteği atıyoruz.
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Geçerli bir kelime seçilmediyse kullanıcıyı uyarıyoruz.
    if (!selectedWord || !selectedWord.documentId) {
      alert('Güncellemek için geçerli bir kelime seçmelisiniz!');
      return;
    }

    // Güncellenecek verileri bir nesnede topluyoruz.
    const updatedWordData = {
      data: {
        word,
        word_tr,
      },
    };

    try {
      // PUT isteğiyle seçilen kelimeyi güncelliyoruz.
      const response = await axios.put(
        `http://34.78.14.168:1337/api/words/${selectedWord.documentId}`,
        updatedWordData
      );

      // Başarılı olursa kullanıcıya bildiriyoruz.
      if (response.status === 200) {
        alert('Kelime Güncellendi');
        // Listeyi temizleyip seçimi sıfırlıyoruz.
        setSearchResults([]);
        setSearchTerm('');
        setSelectedWord(null);
      } else {
        alert('Kelime Güncellenemedi');
      }
    } catch (error) {
      // Hata durumunda kullanıcıyı uyarıyoruz.
      console.error('Güncelleme hatası:', error);
      alert('Kelime Güncellenemedi');
    }
  };

  // Arayüzü oluşturarak kullanıcıya gösteriyoruz.
  return (
    <Container className="mt-5">
      <h2>Kelime Güncelle</h2>
      {/* Kullanıcı kelime arayabilsin diye bir arama alanı sağlıyoruz. */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Kelime ara"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      {/* Arama sonuçları bir tablo içerisinde listeleniyor. */}
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
            {/* Her bir sonuç satır olarak tabloya ekleniyor. */}
            {searchResults.map((result) => (
              <tr key={result.id}>
                <td>{result.word || 'Kelime Bulunamadı'}</td>
                <td>{result.word_tr || 'Türkçe Karşılık Bulunamadı'}</td>
                <td>{result.documentId || 'Document ID Bulunamadı'}</td>
                <td>
                  {/* Güncellemek istediğimiz kelimeyi seçiyoruz. */}
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

      {/* Seçilen kelime için güncelleme formunu görüntülüyoruz. */}
      {selectedWord && (
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3" controlId="formWord">
            <Form.Label>Kelime (Word)</Form.Label>
            {/* Kullanıcının güncellenmiş kelimeyi gireceği alan. */}
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
            {/* Kullanıcının kelimenin Türkçe karşılığını güncelleyeceği alan. */}
            <Form.Control
              type="text"
              placeholder="Türkçe karşılığını güncelle"
              value={word_tr}
              onChange={(e) => setWordTr(e.target.value)}
              required
            />
          </Form.Group>
          {/* Kaydet butonu. */}
          <Button variant="primary" type="submit">
            Güncelle
          </Button>
        </Form>
      )}
    </Container>
  );
}

// Bileşeni diğer sayfalarda kullanabilmek için dışa aktarıyoruz.
export default UpdateWord;
