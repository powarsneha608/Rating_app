

import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Login failed');
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      if (data.role) {
        localStorage.setItem('role', data.role);
      } else {
        localStorage.removeItem('role');
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const goToRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>Login</button>
        
        {error && (
          <div style={styles.error}>
            {error}
            {error.toLowerCase().includes('not found') && (
              <div style={{ marginTop: '10px' }}>
                Not registered?{' '}
                <span style={styles.link} onClick={goToRegister}>Create an account</span>
              </div>
            )}
          </div>
        )}

        {!error && (
          <div style={{ marginTop: '15px' }}>
            Don’t have an account?{' '}
            <span style={styles.link} onClick={goToRegister}>Register here</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '320px',
    textAlign: 'center'
  },
  title: {
    marginBottom: '20px',
    color: '#0077cc'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0077cc',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    marginTop: '15px',
    color: 'red',
    fontSize: '14px'
  },
  link: {
    color: '#0077cc',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px'
  }
};
