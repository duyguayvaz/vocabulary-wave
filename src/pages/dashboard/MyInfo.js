// src/pages/dashboard/MyInfo.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Spinner } from 'react-bootstrap'

function MyInfo() {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    axios
      .get('http://localhost:1337/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserData(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <Card>
      <Card.Body>
        <Card.Title>Bilgilerim</Card.Title>
        {!userData ? (
          <div style={{ textAlign: 'center' }}>
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <p><strong>Kullanıcı Adı:</strong> {userData.username}</p>
            <p><strong>E-posta:</strong> {userData.email}</p>
            {/* Şifre güncelleme vb. ek alanları buraya ekleyebilirsiniz */}
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default MyInfo
