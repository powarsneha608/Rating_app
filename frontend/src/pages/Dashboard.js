

import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Dashboard</h2>
        <p style={styles.role}>
          Welcome, <strong>{role?.toUpperCase() || 'USER'}</strong>
        </p>

        <div style={styles.links}>
          {role === 'admin' && (
            <>
              <Link to="/admin/users" style={styles.linkBtn}>Manage Users</Link>
              <Link to="/admin/stores" style={styles.linkBtn}>Manage Stores</Link>
            </>
          )}
          {role === 'store_owner' && (
            <Link to="/owner/dashboard" style={styles.linkBtn}>Owner Dashboard</Link>
          )}
          {role === 'normal' && (
            <Link to="/stores" style={styles.linkBtn}>View Stores</Link>
          )}
          <Link to="/update-password" style={styles.linkBtn}>Update Password</Link>
        </div>

        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '360px',
    textAlign: 'center'
  },
  title: {
    color: '#0077cc',
    marginBottom: '10px'
  },
  role: {
    color: '#444',
    marginBottom: '25px'
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  linkBtn: {
    padding: '10px',
    backgroundColor: '#e0f0ff',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#0077cc',
    fontWeight: 'bold',
    transition: '0.3s',
    border: '1px solid #b0d7ff'
  },
  logoutBtn: {
    padding: '10px 16px',
    backgroundColor: '#cc0000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
