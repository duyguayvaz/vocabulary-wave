// src/Learning/German/LearnGerman.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';

function LearnGerman() {
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');

        const userResponse = await axios.get('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = userResponse.data.id;
        setUserId(userId);

        const relationResponse = await axios.get(
          `http://localhost:1337/api/relations?populate=*&filters[users_id][$eq]=${userId}`
        );

        const relations = relationResponse.data.data.map(
          (rel) => rel.word_id.documentId
        );

        const wordResponse = await axios.get(
          'http://localhost:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=3'
        );

        const filteredWords = wordResponse.data.data.filter(
          (words) => !relations.includes(words.documentId)
        );
        setWords(filteredWords);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu.');
      }
    };

    fetchData();
  }, []);

  const getRandomWord = () => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setRandomWord(words[randomIndex]);
    } else {
      setRandomWord(null);
    }
  };

  const updateWordStatus = async (status) => {
    if (!randomWord || !userId) return;

    try {
      await axios.post(
        'http://localhost:1337/api/relations',
        {
          data: {
            users_id: userId,
            word_id: randomWord.documentId,
            word_status: status,
          },
        }
      );

      const updatedWords = words.filter((word) => word.id !== randomWord.id);
      setWords(updatedWords);

      if (updatedWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * updatedWords.length);
        setRandomWord(updatedWords[randomIndex]);
      } else {
        setRandomWord(null);
      }
    } catch (err) {
      alert('Kelime durumu güncellenirken bir hata oluştu.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Almanca Öğren</h2>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Button variant="primary" onClick={getRandomWord} className="mb-3">
            Rastgele Kelime Seç
          </Button>
          {randomWord && (
            <Alert variant="success">
              <strong>{randomWord.word}</strong> - {randomWord.word_tr}
              <Row className="mt-3">
                <Col>
                  <Button
                    variant="success"
                    onClick={() => updateWordStatus('know')}
                  >
                    Biliyorum
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="warning"
                    onClick={() => updateWordStatus('notknow')}
                  >
                    Bilmiyorum
                  </Button>
                </Col>
              </Row>
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default LearnGerman;
