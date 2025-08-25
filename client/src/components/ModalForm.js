import React, { useState } from "react";

const API = process.env.REACT_APP_API_BASE_URL || '/api';

function fetchJSON(url, opt) {
  return fetch(url, opt).then(res => {
    if (!res.ok) return res.json().then(j => { throw new Error(j && j.error ? j.error : 'HTTP ' + res.status); });
    return res.json();
  });
}

export default function ModalForm({ plant = null, onClose, onSaved }) {
  const [name, setName] = useState(plant?.name || '');
  const [price, setPrice] = useState(plant?.price ?? '');
  const [cats, setCats] = useState((plant?.categories || []).join(', '));
  const [stock, setStock] = useState(plant?.inStock ?? true);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if(!name || name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if(price === '' || isNaN(price) || Number(price) < 0) e.price = 'Enter a valid price';
    if(!cats || !cats.split(',').map(s=>s.trim()).filter(Boolean).length) e.cats = 'At least 1 category';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if(!validate()) return;
    const payload = {
      name: name.trim(),
      price: Number(price),
      categories: cats.split(',').map(s=>s.trim()).filter(Boolean),
      inStock: Boolean(stock)
    };
    try {
      if (plant) {
        await fetchJSON(`${API}/plants/${plant._id || plant.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      } else {
        await fetchJSON(`${API}/plants`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      }
      onSaved && onSaved();
    } catch (err) {
      setErrors({ submit: err.message || 'Save failed' });
    }
  }

  return (
    <div className="modal-backdrop" style={{display:'flex'}} aria-hidden="false">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <h2 id="modalTitle">{plant ? 'Edit Plant' : 'Add a new plant'}</h2>
        <div className="grid">
          <div>
            <label htmlFor="m_name">Name</label>
            <input id="m_name" className="input" placeholder="e.g., Money Plant" value={name} onChange={e=>setName(e.target.value)} />
            <div className="error" style={{display: errors.name ? 'block' : 'none'}}>{errors.name}</div>
          </div>
          <div>
            <label htmlFor="m_price">Price (₹)</label>
            <input id="m_price" className="input" type="number" min="0" placeholder="e.g., 199" value={price} onChange={e=>setPrice(e.target.value)} />
            <div className="error" style={{display: errors.price ? 'block' : 'none'}}>{errors.price}</div>
          </div>
          <div className="row-2">
            <label htmlFor="m_cats">Categories (comma-separated)</label>
            <input id="m_cats" className="input" placeholder="Indoor, Home Decor" value={cats} onChange={e=>setCats(e.target.value)} />
            <div className="error" style={{display: errors.cats ? 'block' : 'none'}}>{errors.cats}</div>
          </div>
          <div className="row-2" style={{display:'flex', alignItems:'center', gap:10}}>
            <input type="checkbox" id="m_stock" checked={stock} onChange={e=>setStock(e.target.checked)} />
            <label htmlFor="m_stock">In stock</label>
          </div>
        </div>

        {errors.submit && <div className="error" style={{display:'block', marginTop:10}}>{errors.submit}</div>}

        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:14}}>
          <button className="btn-sm" style={{background:'#fff'}} onClick={onClose}>Cancel</button>
          <button className="btn" onClick={submit}>{plant ? 'Update' : 'Add Plant'}</button>
        </div>
      </div>
    </div>
  );
}
