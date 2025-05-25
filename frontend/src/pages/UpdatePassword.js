

import { useState } from 'react';

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleUpdate = async () => {
    setMsg('');
    setIsError(false);
    const res = await fetch('http://localhost:5000/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('✅ Password updated successfully!');
    } else {
      setIsError(true);
      setMsg(data.error || '❌ Failed to update password.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update Password</h2>

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleUpdate} style={styles.button}>Update Password</button>

      {msg && (
        <div style={{ ...styles.message, color: isError ? 'red' : 'green' }}>
          {msg}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  },
  title: {
    marginBottom: '20px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  message: {
    marginTop: '20px',
    fontWeight: 'bold'
  }
};
