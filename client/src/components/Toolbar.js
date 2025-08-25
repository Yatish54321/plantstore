import React, { useState, useEffect } from "react";

export default function Toolbar({ categories = [], onFilter, onAdd, currentSort, onSort }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');

  // propagate changes upward
  useEffect(() => {
    onFilter({ search, category, inStock: availability });
    // eslint-disable-next-line
  }, [category, availability]);

  // debounced search
  useEffect(() => {
    const id = setTimeout(()=> onFilter({ search, category, inStock: availability }), 220);
    return () => clearTimeout(id);
    // eslint-disable-next-line
  }, [search]);

  return (
    <>
      <input
        id="search"
        className="input"
        placeholder="Search plants or categories…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Search"
      />

      <select id="category" className="select" value={category} onChange={e => setCategory(e.target.value)} aria-label="Category">
        <option value="">All categories</option>
        {categories.map((c,i)=> <option key={i} value={c}>{c}</option>)}
      </select>

      <select id="availability" className="select" value={availability} onChange={e => setAvailability(e.target.value)} aria-label="Stock">
        <option value="">All stock states</option>
        <option value="true">In stock</option>
        <option value="false">Out of stock</option>
      </select>

      <div id="sortWrap" style={{display:'contents'}}>
        <select id="sort" className="select" value={currentSort} onChange={e=>onSort(e.target.value)} aria-label="Sort">
          <option value="">Sort: Default</option>
          <option value="priceAsc">Price ↑</option>
          <option value="priceDesc">Price ↓</option>
          <option value="nameAsc">Name A–Z</option>
          <option value="nameDesc">Name Z–A</option>
        </select>
      </div>

      <button id="addBtn" className="btn" aria-haspopup="dialog" onClick={onAdd}>➕ Add Plant</button>
    </>
  );
}
