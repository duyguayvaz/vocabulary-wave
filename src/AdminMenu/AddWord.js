// Bu kütüphanelerle projemizi yönetmek için gerekli paketleri ekliyoruz.
import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

// Yeni bir kelime eklemek için bir bileşen oluşturuyoruz.
function AddWord() {
  // Kelime, Türkçe karşılığı ve Dil ID değerlerini tutmak için state kullanıyoruz.
  const [word, setWord] = useState('');
  const [word_tr, setWordTr] = useState('');
  const [lang_id, setLangId] = useState('');

  // Form gönderildiğinde çalışacak fonksiyonumuz.
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Gönderilecek verileri bir nesne içinde topluyoruz.
    const wordData={
        data :{
            word,
            word_tr,
            lang_id
        }
    }

    try{
        // Burada kelime ekleme işlemi için API'ye POST isteği atıyoruz.
        const response = await axios.post('http://34.78.14.168:1337/api/words', wordData)
        // İşlem başarıyla gerçekleşirse uyarı veriyoruz.
        alert('Kelime Eklendi')
    }
    catch {
        // Hata durumunda kullanıcıya uyarı gösteriyoruz.
        alert('Kelime Eklenemedi')
    }
  };

  // Arayüz kısmında kullanıcıdan kelime bilgilerini alıyoruz.
  return (
    <Container className="mt-5">
      <h2>Kelime Ekle</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formWord">
          <Form.Label>Kelime (Word)</Form.Label>
          {/* Kullanıcı kelimeyi buradan giriyor. */}
          <Form.Control
            type="text"
            placeholder="Kelimeyi girin"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formWordTr">
          <Form.Label>Kelime (Türkçe)</Form.Label>
          {/* Kelimenin Türkçe karşılığını buradan giriyor. */}
          <Form.Control
            type="text"
            placeholder="Türkçe karşılığını girin"
            value={word_tr}
            onChange={(e) => setWordTr(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLangId">
          <Form.Label>Dil ID (lang_id)</Form.Label>
          {/* Hangi dile ait olduğunu belirtmek için Dil ID'sini buradan giriyoruz. */}
          <Form.Control
            type="text"
            placeholder="İngilizce = 1 / Almanca = 3 / Fransızca = 5 / İspanyolca = 11"
            value={lang_id}
            onChange={(e) => setLangId(e.target.value)}
            required
          />
        </Form.Group>
        {/* Formu göndermek için buton. */}
        <Button  
        type="submit" 
        style={{backgroundColor: '#647daf',border: 'none'}}>
          Ekle
        </Button>
      </Form>
    </Container>
  );
}

// Bileşeni dışa aktarıyoruz.
export default AddWord;
