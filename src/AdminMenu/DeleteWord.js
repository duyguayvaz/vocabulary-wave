// Kelime silme işlemleri için gerekli kütüphaneleri içe aktarıyoruz.
import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, Table, InputGroup, FormControl } from 'react-bootstrap';

// DeleteWord bileşeni tanımlıyoruz.
function DeleteWord() {
  // Kullanıcıdan gelen arama terimini ve sonuçlarını tutmak için state oluşturuyoruz.
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Seçilen kelimeyi saklamak için başka bir state tutuyoruz.
  const [selectedWord, setSelectedWord] = useState(null);

  // Kullanıcı kelime ararken çalışacak fonksiyon.
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // En az 2 karakter girildiğinde arama yapıyoruz.
    if (term.length > 1) {
      try {
        // API'ye istek atarak ilgili kelimeleri çekiyoruz.
        const response = await axios.get(
          `http://34.78.14.168:1337/api/words?filters[word][$contains]=${term}`
        );
        // Gelen veriyi arama sonuçlarına kaydediyoruz.
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Arama hatası:', error);
      }
    } else {
      // Kullanıcı 1 karakter girdiğinde listeyi temizliyoruz.
      setSearchResults([]);
    }
  };

  // Silmek istediğimiz kelimeyi seçmek için kullanacağımız fonksiyon.
  const handleSelectWord = (word) => {
    if (!word) {
      alert('Geçersiz kelime verisi!');
      return;
    }
    // Seçilen kelimeyi state'e kaydediyoruz.
    setSelectedWord(word);
  };

  // Seçilen kelimeyi API üzerinden silmeyi sağlayan fonksiyon.
  const handleDelete = async () => {
    // Eğer silmek için geçerli bir kelime seçilmediyse uyarı veriyoruz.
    if (!selectedWord || !selectedWord.documentId) {
      alert('Silmek için geçerli bir kelime seçmelisiniz!');
      return;
    }

    try {
      // API'ye DELETE isteği atarak seçilen kelimeyi siliyoruz.
      const response = await axios.delete(
        `http://34.78.14.168:1337/api/words/${selectedWord.documentId}`
      );

      // Başarılı olursa bildirim verip, listeyi güncelliyoruz.
      alert('Kelime Silindi');
      setSearchResults(searchResults.filter((item) => item.id !== selectedWord.id));
      setSearchTerm('');
      setSelectedWord(null);
    } catch (error) {
      // Hata durumunda konsola yazdırıp kullanıcıyı uyarıyoruz.
      console.error('Silme hatası:', error);
      alert('Kelime Silinemedi');
    }
  };

  // Arayüz bileşenlerini döndürüyoruz.
  return (
    <Container className="mt-5">
      <h2>Kelime Sil</h2>
      {/* Kullanıcı kelime araması yapabilsin diye bir InputGroup ekliyoruz. */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Kelime ara"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      {/* Arama sonuçlarını tablo şeklinde gösteriyoruz. */}
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
            {/* Her bir arama sonucunu tabloya satır olarak ekliyoruz. */}
            {searchResults.map((result) => (
              <tr key={result.id}>
                <td>{result.word || 'Kelime Bulunamadı'}</td>
                <td>{result.word_tr || 'Türkçe Karşılık Bulunamadı'}</td>
                <td>{result.documentId || 'Document ID Bulunamadı'}</td>
                <td>
                  {/* Silmek için önce seçmemiz gerekiyor. */}
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

      {/* Kelime seçildiyse silme butonunu gösteriyoruz. */}
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

// Bileşeni diğer dosyalarda kullanmak için dışa aktarıyoruz.
export default DeleteWord;
