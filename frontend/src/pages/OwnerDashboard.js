

import { useEffect, useState } from 'react';

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [raters, setRaters] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/owner/my-store', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
      .then(async res => {
        const text = await res.text();
        if (!text) {
          setStore(null);
          setMsg('No store found for this owner.');
          return;
        }
        try {
          setStore(JSON.parse(text));
        } catch {
          setStore(null);
          setMsg('Invalid store data.');
        }
      });

    fetch('http://localhost:5000/api/owner/my-raters', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
      .then(async res => {
        const text = await res.text();
        if (!text) {
          setRaters([]);
          return;
        }
        try {
          setRaters(JSON.parse(text));
        } catch {
          setRaters([]);
        }
      });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Store</h2>

      {msg && <div style={styles.message}>{msg}</div>}

      {store && (
        <div style={styles.storeCard}>
          <h3 style={{ margin: '0 0 10px' }}>{store.name}</h3>
          <p style={styles.storeInfo}><strong>Address:</strong> {store.address}</p>
          <p style={styles.storeInfo}>
            <strong>Average Rating:</strong> <span style={styles.rating}>{store.avg_rating.toFixed(1)}</span>
          </p>
        </div>
      )}

      <h3 style={{ marginTop: 40, marginBottom: 10 }}>Raters</h3>
      {raters.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#666' }}>No raters yet.</p>
      ) : (
        <ul style={styles.ratersList}>
          {raters.map(r => (
            <li key={r.email} style={styles.raterItem}>
              <div>
                <strong>{r.name}</strong> ({r.email})
              </div>
              <div style={styles.raterRating}>Rating: <span style={styles.rating}>{r.rating}</span></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '20px auto',
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    color: '#333',
  },
  title: {
    borderBottom: '2px solid #4caf50',
    paddingBottom: 8,
    color: '#2e7d32',
  },
  message: {
    backgroundColor: '#ffdddd',
    border: '1px solid #e57373',
    padding: '10px 15px',
    borderRadius: 4,
    color: '#d32f2f',
    marginBottom: 15,
  },
  storeCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 6,
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
  },
  storeInfo: {
    margin: '5px 0',
    fontSize: 16,
  },
  rating: {
    color: '#ffb400',
    fontWeight: 'bold',
  },
  ratersList: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  raterItem: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: '10px 15px',
    marginBottom: 10,
    borderRadius: 5,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  raterRating: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
};
