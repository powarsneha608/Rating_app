
import { useState } from 'react';

export default function Register() {
  const isAdmin = localStorage.getItem('role') === 'admin';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: isAdmin ? 'normal' : 'normal'
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (form.name.length < 20 || form.name.length > 60) return 'Name must be 20-60 characters.';
    if (form.address.length > 400) return 'Address max 400 characters.';
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password))
      return 'Password must be 8-16 chars, 1 uppercase, 1 special char.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email.';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || 'Registered successfully!');
      window.location.href = '/';
    } else {
      setError(data.error || 'Registration failed');
    }
  };

  const goToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="normal">Normal</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <button type="submit" style={styles.button}>Register</button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        <div style={{ marginTop: '15px' }}>
          Already have an account?{' '}
          <span style={styles.link} onClick={goToLogin}>Login here</span>
        </div>
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
    width: '340px',
    textAlign: 'center'
  },
  title: {
    marginBottom: '20px',
    color: '#0077cc'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '15px'
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '15px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#0077cc',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    marginTop: '10px',
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

