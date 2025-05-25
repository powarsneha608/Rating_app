import { useEffect, useState } from 'react';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [msg, setMsg] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('name', search);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    fetch(`http://localhost:5000/api/admin/stores?${params.toString()}`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
      .then(async res => {
        if (!res.ok) {
          setStores([]);
          setMsg('Failed to fetch stores.');
          return;
        }
        let data = [];
        try {
          data = await res.json();
        } catch {
          setStores([]);
          setMsg('Invalid JSON response from server.');
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setStores(data);
          setMsg('');
        } else if (Array.isArray(data) && data.length === 0) {
          setStores([]);
          setMsg('No stores found.');
        } else {
          setStores([]);
          setMsg('Unexpected response from server.');
        }
      })
      .catch(err => {
        setStores([]);
        setMsg('Network error: ' + err.message);
      });
  }, [search, sort, order, refresh]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddStore = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:5000/api/admin/create-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(form)
    });
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (res.ok) {
      setMsg('Store added successfully!');
      setForm({ name: '', email: '', address: '', owner_id: '' });
      setRefresh(r => !r);
    } else {
      setMsg(data.error || 'Failed to add store');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <h2>Stores</h2>
      <input
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="name">Name</option>
        <option value="address">Address</option>
        <option value="avg_rating">Rating</option>
      </select>
      <select value={order} onChange={e => setOrder(e.target.value)}>
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
      <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', marginBottom: '1em' }}>
        <thead>
          <tr style={{ background: '#f0f4fa' }}>
            <th style={{ padding: '0.5em' }}>Name</th>
            <th style={{ padding: '0.5em' }}>Email</th>
            <th style={{ padding: '0.5em' }}>Address</th>
            <th style={{ padding: '0.5em' }}>Owner ID</th>
            <th style={{ padding: '0.5em' }}>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>{msg || 'No stores found.'}</td>
            </tr>
          ) : (
            stores.map(store => (
              <tr key={store.id}>
                <td style={{ padding: '0.5em' }}>{store.name}</td>
                <td style={{ padding: '0.5em' }}>{store.email}</td>
                <td style={{ padding: '0.5em' }}>{store.address}</td>
                <td style={{ padding: '0.5em' }}>{store.owner_id}</td>
                <td style={{ padding: '0.5em' }}>{store.avg_rating || 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {msg && stores.length > 0 && (
        <div style={{ color: msg === 'Store added successfully!' ? 'green' : 'red', marginTop: '10px' }}>{msg}</div>
      )}
      <h3>Add Store</h3>
      <form onSubmit={handleAddStore}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="owner_id" placeholder="Owner ID" value={form.owner_id} onChange={handleChange} required />
        <button type="submit">Add Store</button>
      </form>
    </div>
  );
}
