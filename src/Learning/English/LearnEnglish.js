import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';

function LearnEnglish() {
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
          'http://localhost:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=1'
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
    <Card className="mt-5 mx-auto" style={{maxWidth: '600px', backgroundColor: '#f3f3f3' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">İngilizce</Card.Title>
        {error ? (
          <div className="alert alert-danger text-center">
            {error}</div>
        ) : (
          <>
            <Button onClick={getRandomWord} className="mb-4 d-block mx-auto" style={{backgroundColor: '#647daf',border: 'none'}}>
              Öğrenmeye Başla
            </Button>
            {randomWord && (
              <>
                <Card.Text className="text-center">
                  <strong>{randomWord.word}</strong> - {randomWord.word_tr}
                </Card.Text>
                <Row className="mt-3">
                  <Col className="text-center">
                    <Button
                      variant="success"
                      onClick={() => updateWordStatus('know')}
                    >
                      Biliyorum
                    </Button>
                  </Col>
                  <Col className="text-center">
                    <Button
                      variant="danger"
                      onClick={() => updateWordStatus('notknow')}
                    >
                      Bilmiyorum
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default LearnEnglish;
