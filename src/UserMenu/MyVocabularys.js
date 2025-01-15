import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Alert, Row, Col } from 'react-bootstrap';

function MyVocabularys() {
  const [wordStats, setWordStats] = useState({});
  const [error, setError] = useState(null);

  const languages = [
    { id: 1, langId: 2, name: 'English', key: 'english' },
    { id: 3, langId: 7, name: 'German', key: 'german' },
    { id: 5, langId: 8, name: 'French', key: 'french' },
    { id: 11, langId: 13, name: 'Spanish', key: 'spanish' },
  ];

  const fetchWordStatistics = async (langId, wordId, langKey) => {
    try {
      const token = localStorage.getItem('jwt');
      const userResponse = await axios.get('http://localhost:1337/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userResponse.data.id;

      const wordResponse = await axios.get(
        `http://localhost:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=${wordId}`
      );

      const knownWordsResponse = await axios.get(
        `http://localhost:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&filters[word_id][lang_id][id][$eq]=${langId}&filters[word_status][$eq]=know`
      );

      const knownWordsList = knownWordsResponse.data.data.map(
        (relation) => relation.word_id.word
      );

      setWordStats((prevStats) => ({
        ...prevStats,
        [langKey]: {
          total: wordResponse.data.data.length,
          known: knownWordsList,
        },
      }));
    } catch (err) {
      setError(`Veriler yüklenirken bir hata oluştu: ${err.message}`);
    }
  };

  useEffect(() => {
    languages.forEach(({ langId, id, key }) => fetchWordStatistics(langId, id, key));
  }, []);

  const calculatePercentage = (known, total) =>
    total > 0 ? ((known / total) * 100).toFixed(2) : 0;

  return (
    <Container className="mt-5">
      <h2>Kelimelerim</h2>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {languages.map(({ key, name }) => (
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{name}</Card.Title>
                  <Card.Text>
                    <strong>Bildiğiniz Kelime Sayısı:</strong> {wordStats[key]?.known.length || 0}
                    <br />
                    <strong>Bildiğiniz Yüzde:</strong> %{calculatePercentage(wordStats[key]?.known.length || 0, wordStats[key]?.total || 0)}
                  </Card.Text>
                </Card.Body>
              </Card>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MyVocabularys;
