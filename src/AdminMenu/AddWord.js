import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

function AddWord() {
  const [word, setWord] = useState('');
  const [word_tr, setWordTr] = useState('');
  const [lang_id, setLangId] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();

    const wordData={
        data :{
            word,
            word_tr,
            lang_id
        }
    }

    try{
        const response = await axios.post('http://localhost:1337/api/words', wordData)
        alert('Kelime Eklendi')
    }
    catch {
        alert('Kelime Eklenemedi')
    }
  };

  return (
    <Container className="mt-5">
      <h2>Kelime Ekle</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formWord">
          <Form.Label>Kelime (Word)</Form.Label>
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
          <Form.Control
            type="text"
            placeholder="İngilizce = 1 / Almanca = 3 / Fransızca = 5 / İspanyolca = 11"
            value={lang_id}
            onChange={(e) => setLangId(e.target.value)}
            required
          />
        </Form.Group>
        <Button  
        type="submit" 
        style={{backgroundColor: '#647daf',border: 'none'}}>
          Ekle
        </Button>
      </Form>
    </Container>
  );
}

export default AddWord;
