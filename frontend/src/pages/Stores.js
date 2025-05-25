

import React, { useEffect, useState } from 'react';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [myRatings, setMyRatings] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      const params = new URLSearchParams();
      if (search) params.append('name', search);
      if (sort) params.append('sort', sort);
      if (order) params.append('order', order);
      const res = await fetch(`http://localhost:5000/api/user/stores?${params.toString()}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await res.json();
      setStores(data);
    };
    fetchStores();
  }, [search, sort, order]);

  const handleRate = async (storeId, rating) => {
    await fetch('http://localhost:5000/api/user/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ store_id: storeId, rating })
    });
    setMyRatings({ ...myRatings, [storeId]: rating });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Store Listings</h2>

      <div style={styles.controls}>
        <input
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.input}
        />
        <select value={sort} onChange={e => setSort(e.target.value)} style={styles.select}>
          <option value="name">Name</option>
          <option value="address">Address</option>
          <option value="avg_rating">Rating</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)} style={styles.select}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div style={styles.storeList}>
        {stores.map(store => (
          <div key={store.id} style={styles.card}>
            <h3 style={styles.storeName}>{store.name}</h3>
            <p style={styles.storeAddress}>{store.address}</p>
            <p>Average Rating: <strong>{store.avg_rating || 'N/A'}</strong></p>
            <div style={styles.ratingSection}>
              <span style={{ marginRight: 8 }}>Your Rating:</span>
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => handleRate(store.id, num)}
                  style={{
                    ...styles.ratingButton,
                    backgroundColor: myRatings[store.id] === num ? '#0077cc' : '#eee',
                    color: myRatings[store.id] === num ? '#fff' : '#333'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh'
  },
  title: {
    textAlign: 'center',
    color: '#0077cc',
    marginBottom: '20px'
  },
  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minWidth: '180px'
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  storeList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  storeName: {
    margin: '0 0 5px 0',
    color: '#0077cc'
  },
  storeAddress: {
    color: '#666',
    margin: '0 0 10px 0'
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '10px'
  },
  ratingButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  logoutBtn: {
    marginTop: '40px',
    padding: '10px 20px',
    backgroundColor: '#cc0000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};
