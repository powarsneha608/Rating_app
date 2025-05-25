import { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'normal' });
  const [msg, setMsg] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', address: '', role: 'normal' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('name', search);
    if (role) params.append('role', role);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    fetch(`http://localhost:5000/api/admin/users?${params.toString()}`, {
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(async res => {
        // Log status for debugging
        console.log('GET /api/admin/users status:', res.status);
        if (res.status === 401 || res.status === 403) {
          setUsers([]);
          setMsg('Access denied. Please log in as admin.');
          return;
        }
        if (!res.ok) {
          setUsers([]);
          setMsg('Failed to fetch users. Make sure you are logged in as admin and backend is running.');
          return;
        }
        let data = [];
        try {
          data = await res.json();
        } catch {
          setUsers([]);
          setMsg('Invalid JSON response from server.');
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          setMsg('');
        } else if (Array.isArray(data) && data.length === 0) {
          setUsers([]);
          setMsg('No users found.');
        } else {
          setUsers([]);
          setMsg('Unexpected response from server.');
        }
      })
      .catch(err => {
        setUsers([]);
        setMsg('Network error: ' + err.message);
      });
  }, [search, role, sort, order, refresh]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddUser = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:5000/api/auth/register', {
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
      setMsg('User added successfully!');
      setForm({ name: '', email: '', password: '', address: '', role: 'normal' });
      setRefresh(r => !r);
    } else {
      setMsg(data.error || 'Failed to add user');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = user => {
    setEditId(user.id);
    setEditForm({ name: user.name, email: user.email, address: user.address, role: user.role });
  };

  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleUpdateUser = async () => {
    setMsg('');
    const res = await fetch(`http://localhost:5000/api/admin/users/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(editForm)
    });
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (res.ok) {
      setMsg('User updated successfully!');
      setEditId(null);
      setRefresh(r => !r);
    } else {
      setMsg(data.error || 'Failed to update user');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <h2>Users</h2>
      <input
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="">All Roles</option>
        <option value="normal">Normal</option>
        <option value="admin">Admin</option>
        <option value="store_owner">Store Owner</option>
      </select>
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="address">Address</option>
        <option value="role">Role</option>
      </select>
      <select value={order} onChange={e => setOrder(e.target.value)}>
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
      <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', marginBottom: '1em' }}>
        <thead>
          <tr style={{ background: '#f0f4fa' }}>
            <th style={{ padding: '0.5em' }}>ID</th>
            <th style={{ padding: '0.5em' }}>Name</th>
            <th style={{ padding: '0.5em' }}>Email</th>
            <th style={{ padding: '0.5em' }}>Address</th>
            <th style={{ padding: '0.5em' }}>Role</th>
            <th style={{ padding: '0.5em' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>{msg || 'No users found.'}</td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u.id}>
                <td style={{ padding: '0.5em' }}>{u.id}</td>
                {editId === u.id ? (
                  <>
                    <td style={{ padding: '0.5em' }}>
                      <input name="name" value={editForm.name} onChange={handleEditChange} />
                    </td>
                    <td style={{ padding: '0.5em' }}>
                      <input name="email" value={editForm.email} onChange={handleEditChange} />
                    </td>
                    <td style={{ padding: '0.5em' }}>
                      <input name="address" value={editForm.address} onChange={handleEditChange} />
                    </td>
                    <td style={{ padding: '0.5em' }}>
                      <select name="role" value={editForm.role} onChange={handleEditChange}>
                        <option value="normal">Normal</option>
                        <option value="admin">Admin</option>
                        <option value="store_owner">Store Owner</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.5em' }}>
                      <button onClick={handleUpdateUser}>Save</button>
                      <button style={{ marginLeft: 8 }} onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '0.5em' }}>{u.name}</td>
                    <td style={{ padding: '0.5em' }}>{u.email}</td>
                    <td style={{ padding: '0.5em' }}>{u.address}</td>
                    <td style={{ padding: '0.5em' }}>{u.role}</td>
                    <td style={{ padding: '0.5em' }}>
                      <button onClick={() => handleEdit(u)}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {msg && users.length > 0 && (
        <div style={{ color: msg.includes('success') ? 'green' : 'red', marginTop: '10px' }}>{msg}</div>
      )}
      <h3>Add User</h3>
      <form onSubmit={handleAddUser}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="normal">Normal</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}
