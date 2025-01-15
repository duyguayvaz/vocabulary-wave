// React kütüphanesini ve bootstrap bileşenlerini projeye dahil ediyoruz.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Admin menüsü için bir bileşen oluşturuyoruz.
function AdminMenu() {
  // Sayfalar arası geçiş yapmak için useNavigate hook'unu kullanıyoruz.
  const navigate = useNavigate();

  // "Kelime Ekle" butonuna tıklandığında yönlendirilecek fonksiyon.
  const handleAddWord = () => {
    navigate('/add-word');
  };

  // "Kelime Güncelle" butonuna tıklandığında yönlendirilecek fonksiyon.
  const handleupdateWord =()=>{
    navigate('/update-word')
  }

  // "Kelime Sil" butonuna tıklandığında yönlendirilecek fonksiyon.
  const handleDeleteWord=()=>{
    navigate('/delete-word')
  }

  // Card içerisinde yönetim menüsü butonlarını gösteriyoruz.
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">Admin Menü</Card.Title>
        <Button
          className="button mb-3 w-100"
          onClick={handleAddWord}
        >
          Kelime Ekle
        </Button>
        <Button 
          className="button mb-3 w-100" 
          onClick={handleupdateWord}>
          Kelime Güncelle
        </Button>
        <Button  
          className="button mb-3 w-100"
          onClick={handleDeleteWord}>
          Kelime Sil
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bu bileşeni projede kullanabilmek için dışa aktarıyoruz.
export default AdminMenu;
