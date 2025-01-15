import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için import
import axios from 'axios';
import { Container, Alert, Button, Form } from 'react-bootstrap';

function QuizGerman() {
  const [learnedWords, setLearnedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Yönlendirme için hook

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
        `http://localhost:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=7&filters[word_status][$eq]=learned`
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
      const randomIndex = Math.floor(Math.random() * learnedWords.length);
      setCurrentWord(learnedWords[randomIndex]);
      setFeedback(null);
      setUserAnswer('');
    } else {
      setCurrentWord(null);
      setFeedback('Quiz tamamlandı!');
      setTimeout(() => navigate('/german'), 2000); // 2 saniye sonra bir önceki menüye dön
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

      setFeedback(isCorrect ? 'Doğru cevap! Kelime "know" olarak işaretlendi.' : 'Yanlış cevap. Kelime "notknow" olarak işaretlendi.');

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
    <Container className="mt-5">
      <h2>Quiz German</h2>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {!currentWord && (
            <Button variant="primary" onClick={handleNextWord} className="mb-3">
              Quiz'e Başla
            </Button>
          )}
          {currentWord && (
            <Alert variant="info">
              <strong>{currentWord.word}</strong> kelimesinin Türkçesi nedir?
              <Form onSubmit={handleAnswerSubmit} className="mt-3">
                <Form.Group controlId="userAnswer">
                  <Form.Control
                    type="text"
                    placeholder="Türkçe karşılığını yazın"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="success" type="submit" className="mt-2">
                  Cevabı Kontrol Et
                </Button>
              </Form>
            </Alert>
          )}
          {feedback && <Alert variant={feedback.includes('Doğru') ? 'success' : 'danger'}>{feedback}</Alert>}
        </>
      )}
    </Container>
  );
}

export default QuizGerman;
