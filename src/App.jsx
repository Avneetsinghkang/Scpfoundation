import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  // Component State 
  const [records, setRecords] = useState([]);
  const [view, setView] = useState('home');
  const [selecteditem, setSelecteditem] = useState(null);
  const [form, setForm] = useState({ item: '', class: '', description: '', containment: '', image: '' });

  // Fetch all records on application load
  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    const { data, error } = await supabase.from('Scp foundation').select();
    if (!error) setRecords(data);
  }

  // Generic input handler for form elements
  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Send request to Supabase to insert new record
  // Refresh list of records (fetchRecords) after new record submitted
  // Resets the form to empty
  async function handleSubmit() {
    await supabase.from('Scp foundation').insert([form]);
    fetchRecords();
    setForm({ item: '', class: '', description: '', containment: '', image: '' });
  }

  // Delete record from Supabase then refresh records after deletion
  async function handleDelete(id) {
    await supabase.from('Scp foundation').delete().eq('id', id);
    fetchRecords();
  }

  // Send request to Supabase to update row / record in table
  // Then refetch all records from table (fetchRecords)
  async function handleEdit(id) {
    await supabase.from('Scp foundation').update(form).eq('id', id);
    fetchRecords();
    setForm({ item: '', class: '', description: '', containment: '', image: '' });
  }

  // Navigate to the next record in the detail view
  function handleNext() {
    const sortedRecords = [...records].sort((a, b) => a.id - b.id);
    const currentIndex = sortedRecords.findIndex(rec => rec.id === selecteditem.id);
    const nextIndex = (currentIndex + 1) % sortedRecords.length; // Loop back to first record if at the end
    setSelecteditem(sortedRecords[nextIndex]);
  }

  return (
    <div className="app">
      {/* Nav section. Loop through each record and render a button using the item name */}
      <nav>
        <h2>SCP Files</h2>
        {
          records
            .sort((a, b) => a.id - b.id) // Sort by id in ascending order
            .map(
              (rec) => (
                <button key={rec.id} onClick={() => { setSelecteditem(rec); setView('detail') }}>
                  {rec.item}
                </button>
              )
            )
        }
        {/* Admin button */}
        <button onClick={() => setView('admin')}>Admin</button>
      </nav>

      {/* Display record section (detail view mode) */}
      {
        view === 'detail' && selecteditem && (
          <div className="detail">
            <div className="button-container">
              <button onClick={() => setView('home')}>Back</button>
              <button onClick={handleNext}>Next</button>
            </div>
            <h2>{selecteditem.item}</h2>
            <h4>{selecteditem.class}</h4>
            <img src={selecteditem.image} alt={selecteditem.item} />
            <p>{selecteditem.description}</p>
            <p>{selecteditem.containment}</p>
          </div>
        )
      }

      {/* Admin section CRUD functions (admin view mode) */}
      {
        view === 'admin' && (
          <div className="admin">
            <div className="button-container">
              <button onClick={() => setView('home')}>Back</button>
            </div>
            <h2>Admin Panel</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th><th>Class</th><th>Description</th><th>Containment</th><th>Image</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.item}</td>
                    <td>{rec.class}</td>
                    <td>{rec.description}</td>
                    <td>{rec.containment}</td>
                    <td><img src={rec.image} alt="" width="50" /></td>
                    <td>
                      <button onClick={() => setForm(rec)}>Edit</button>
                      <br></br>
                      <button onClick={() => handleDelete(rec.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="form">
              <input name="item" value={form.item} onChange={handleInputChange} placeholder="Item" />
              <input name="class" value={form.class} onChange={handleInputChange} placeholder="Class" />
              <input name="description" value={form.description} onChange={handleInputChange} placeholder="Description" />
              <input name="containment" value={form.containment} onChange={handleInputChange} placeholder="Containment" />
              <input name="image" value={form.image} onChange={handleInputChange} placeholder="Image URL" />
              {form.id ? (
                <button onClick={() => handleEdit(form.id)}>Update</button>
              ) : (
                <button onClick={handleSubmit}>Create</button>
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;