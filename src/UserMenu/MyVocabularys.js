// Bu bileşen, kullanıcının hangi dilde kaç kelime bildiğini ve toplam kelime sayısını gösterir.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert } from 'react-bootstrap';

function MyVocabularys() {
  // wordStats: her dil için toplam kelime ve bilinen kelime listesini tutar
  // error: olası hata mesajları
  const [wordStats, setWordStats] = useState({});
  const [error, setError] = useState(null);

  // Uygulamada hangi dillerin olduğunu IDsine göre dizi olarak tanımlıyoruz.
  const languages = [
    { id: 1, langId: 2, name: 'İngilizce', key: 'english' },
    { id: 3, langId: 7, name: 'Almanca', key: 'german' },
    { id: 5, langId: 8, name: 'Fransızca', key: 'french' },
    { id: 11, langId: 13, name: 'İspanyolca', key: 'spanish' },
  ];

  // Her dil için API'den kelime istatistiklerini çekiyoruz.
  const fetchWordStatistics = async (langId, wordId, langKey) => {
    try {
      const token = localStorage.getItem('jwt');

      // Kullanıcı bilgilerini alıyoruz.
      const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userResponse.data.id;

      // Bu dilde (wordId) toplam kaç kelime var?
      const wordResponse = await axios.get(
        `http://34.78.14.168:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=${wordId}`
      );

      // Kullanıcının "know" durumunda işaretlediği kelimeler
      const knownWordsResponse = await axios.get(
        `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&filters[word_id][lang_id][id][$eq]=${langId}&filters[word_status][$eq]=know`
      );

      // Kullanıcının "know" olarak işaretlediği kelimelerin listesini çıkartıyoruz.
      const knownWordsList = knownWordsResponse.data.data.map(
        (relation) => relation.word_id.word
      );

      // wordStats state'ini güncelliyoruz: her dil için toplam kelime sayısı ve "known" kelimelerin listesi
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

  // Bileşen yüklendiğinde, dizi içindeki her dil için fetchWordStatistics fonksiyonunu çağırıyoruz.
  useEffect(() => {
    languages.forEach(({ langId, id, key }) => fetchWordStatistics(langId, id, key));
  }, []);

  // Bilinen kelime sayısını toplam kelime sayısına bölerek yüzde hesaplıyoruz.
  const calculatePercentage = (known, total) =>
    total > 0 ? ((known / total) * 100).toFixed(2) : 0;

  // Kartta her dil için bildiği kelime sayısı ve ilerleme yüzdesini gösteriyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '500px' }}>
      <Card.Body>
        <Card.Title className="title mb-4">Kelime Haznem</Card.Title>
        {error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {/* languages dizisini dönerek her bir dil için kart oluşturuyoruz */}
            {languages.map(({ key, name }) => (
              <Card className="mb-3 shadow-sm" key={key}>
                <Card.Body>
                  <Card.Title>{name}</Card.Title>
                  <Card.Text>
                    {/* Bilinen kelime sayısını ve yüzdelik oranı gösteriyoruz */}
                    <strong>Bildiğim Kelime Sayısı:</strong> {wordStats[key]?.known.length || 0}
                    <br />
                    <strong>İlerleme Kaydı:</strong> %
                    {calculatePercentage(
                      wordStats[key]?.known.length || 0,
                      wordStats[key]?.total || 0
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz.
export default MyVocabularys;
