import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, Button, Form } from 'react-bootstrap';

function QuizFrench() {
  const [learnedWords, setLearnedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLearnedWords();
  }, []);

  const fetchLearnedWords = async () => {
    try {
      const token = localStorage.getItem('jwt');

      const userResponse = await axios.get('http://localhost:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userResponse.data.id;

      const relationResponse = await axios.get(
        `http://localhost:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=8&filters[word_status][$eq]=learned`
      );

      const words = relationResponse.data.data.map((rel) => ({
        documentId: rel.documentId,
        word: rel.word_id.word,
        word_tr: rel.word_id.word_tr,
      }));

      setLearnedWords(words);
    } catch (err) {
      setError('Learned kelimeler yüklenirken bir hata oluştu.');
      console.error(err);
    }
  };

  const handleNextWord = () => {
    if (learnedWords.length > 0) {
      // --> Yeni eklenen kod: Daha önce seçilmeyen bir kelime seçme
      const randomIndex = Math.floor(Math.random() * learnedWords.length);
      const selectedWord = learnedWords[randomIndex];
      setCurrentWord(selectedWord);
      
      // --> Yeni eklenen kod: Seçilen kelimeyi listeden çıkarma
      setLearnedWords((prevWords) => prevWords.filter((word) => word.documentId !== selectedWord.documentId));
      
      setFeedback(null);
      setUserAnswer('');
    } else {
      setCurrentWord(null);
      setFeedback('Quiz tamamlandı!');
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!currentWord) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.word_tr.toLowerCase();
    const newStatus = isCorrect ? 'know' : 'notknow';

    try {
      const token = localStorage.getItem('jwt');

      await axios.put(
        `http://localhost:1337/api/relations/${currentWord.documentId}`,
        {
          data: {
            word_status: newStatus,
          },
        }
      );

      setFeedback(isCorrect ? 'Doğru cevap!' : 'Yanlış cevap.');

      // Güncellenen kelimeyi state'den çıkar ve yeni bir kelimeyi seç
      setLearnedWords((prevWords) =>
        prevWords.filter((word) => word.documentId !== currentWord.documentId)
      );

      setTimeout(() => {
        handleNextWord(); // Yeni kelimeyi seç
      }, 2000); // 2 saniye bekle
    } catch (err) {
      console.error('Durum güncellenirken bir hata oluştu:', err.response?.data || err.message);
      alert('Kelimenin durumu güncellenirken bir hata oluştu.');
    }
  };

  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title className="text-center">Quiz</Card.Title>
        {error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {!currentWord && (
              <Button onClick={handleNextWord} className="mb-3 d-block mx-auto" style={{backgroundColor: '#647daf',border: 'none'}}>
                Quiz'e Başla
              </Button>
            )}
            {currentWord && (
              <Alert style={{backgroundColor: '#f3f3f3'}}>
                <strong>{currentWord.word}</strong> kelimesinin Türkçesi nedir?
                <Form onSubmit={handleAnswerSubmit} className="mt-3">
                  <Form.Group controlId="userAnswer" >
                    <Form.Control
                      type="text"
                      placeholder="Türkçe karşılığını yazın"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" className="mt-2 d-block mx-auto" style={{backgroundColor: '#647daf',border: 'none'}}>
                    Cevabı Kontrol Et
                  </Button>
                </Form>
              </Alert>
            )}
            {feedback && (
              <Alert variant={feedback.includes('Doğru') ? 'success' : 'danger'} className="mt-3">
                {feedback}
              </Alert>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default QuizFrench;
