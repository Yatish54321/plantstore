import React from "react";

export default function PlantCard({ plant, onEdit, onDelete }) {
  const cats = plant.categories || [];
  const imgLabel = (cats[0] || 'Plant').toUpperCase();

  return (
    <div className="card">
      <div className="img" aria-hidden="true">
        <div style={{opacity:.9,fontWeight:800,letterSpacing:'.4px'}}>{imgLabel}</div>
      </div>
      <h3>{plant.name || 'Untitled Plant'}</h3>
      <div className="price">₹{plant.price ?? 0}</div>
      <div className="badges">
        {cats.map((cat, i) => <span className="tag" key={i}>🌱 {cat}</span>)}
      </div>
      <div className={`stock ${plant.inStock ? 'in' : 'out'}`}>{plant.inStock ? 'In stock' : 'Out of stock'}</div>
      <div className="card-footer">
        <button className="btn-sm edit" onClick={onEdit}>Edit</button>
        <button className="btn-sm del" title="Delete" onClick={onDelete}>🗑️</button>
      </div>
    </div>
  );
}
