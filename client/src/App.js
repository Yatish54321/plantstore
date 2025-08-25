import React, { useEffect, useState, useRef } from "react";
import Toolbar from "./components/Toolbar";
import PlantCard from "./components/PlantCard";
import ModalForm from "./components/ModalForm";
import Toast from "./components/Toast";

const API = process.env.REACT_APP_API_BASE_URL || "/api";

function fetchJSON(url, opt) {
  return fetch(url, opt).then(res => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  });
}

export default function App() {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mongoState, setMongoState] = useState('checking…');
  const [toastMsg, setToastMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlant, setEditPlant] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', inStock: '', sort: '' });

  const toolbarRef = useRef(null);

  async function loadHealth() {
    try {
      const h = await fetchJSON(API + '/health');
      setMongoState(h.mongo ? 'Connected' : 'Not Connected (Memory)');
    } catch (e) {
      setMongoState('Unknown');
    }
  }

  async function loadCategories(){
    try {
      const data = await fetchJSON(API + '/categories');
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    }
  }

  // load sample (no-op if backend doesn't expect)
  async function loadSample() {
    try { await fetch(API + '/plants/sample', { method: 'POST' }).catch(()=>{}); } catch(e){}
  }

  function applyClientSort(arr, sortVal){
    const copy = [...arr];
    if(sortVal === 'priceAsc') copy.sort((a,b)=>(a.price||0)-(b.price||0));
    else if(sortVal === 'priceDesc') copy.sort((a,b)=>(b.price||0)-(a.price||0));
    else if(sortVal === 'nameAsc') copy.sort((a,b)=>(a.name||'').localeCompare(b.name||''));
    else if(sortVal === 'nameDesc') copy.sort((a,b)=>(b.name||'').localeCompare(a.name||''));
    return copy;
  }

  async function loadPlants(opts = {}) {
    setLoading(true);
    try {
      const q = {
        search: opts.search ?? filters.search,
        category: opts.category ?? filters.category,
        inStock: opts.inStock ?? filters.inStock
      };
      const params = new URLSearchParams();
      if (q.search) params.append('search', q.search);
      if (q.category) params.append('category', q.category);
      if (q.inStock) params.append('inStock', q.inStock);

      const data = await fetchJSON(API + '/plants?' + params.toString());
      let list = data.plants || [];
      list = applyClientSort(list, opts.sort ?? filters.sort);
      setPlants(list);
    } catch (e) {
      console.error(e);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // init
    loadHealth();
    loadCategories();
    loadSample();
    loadPlants();
    // sticky toolbar behavior
    const onScroll = () => {
      const toolbar = toolbarRef.current;
      const header = document.querySelector('header');
      if (!toolbar || !header) return;
      if (window.scrollY > header.offsetHeight) toolbar.classList.add('sticky');
      else toolbar.classList.remove('sticky');
    };
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  // If filters change, reload, debounced for search
  useEffect(() => {
    const id = setTimeout(() => loadPlants(filters), 220);
    return () => clearTimeout(id);
  }, [filters]);

  function openAddModal() {
    setEditPlant(null);
    setModalOpen(true);
  }
  function openEditModal(p) {
    setEditPlant(p);
    setModalOpen(true);
  }

  async function handleDelete(plant) {
    if (!confirm('Delete plant?')) return;
    try {
      await fetchJSON(API + '/plants/' + (plant._id || plant.id), { method: 'DELETE' });
      setToastMsg('Deleted');
      loadPlants();
    } catch (e) {
      console.error(e);
      setToastMsg('Delete failed');
    }
  }

  return (
    <div>
      <header>
        <div className="header-container container">
          <div className="brand">
            <div className="logo">🌿</div>
            <div className="brand-text">
              <div className="brand-title">Urvann Mini Plant Store</div>
              <div className="brand-sub">Bringing greenery closer to you</div>
            </div>
          </div>
          <span className="pill">Mongo: <strong id="mongoState">{mongoState}</strong></span>
        </div>
      </header>

      <main className="container">
        <div className="toolbar" ref={toolbarRef} role="region" aria-label="Filters and actions">
          <Toolbar
            categories={categories}
            onFilter={(next) => setFilters(prev => ({ ...prev, ...next }))}
            onAdd={openAddModal}
            currentSort={filters.sort}
            onSort={(s) => setFilters(prev => ({...prev, sort: s}))}
          />
        </div>

        <div id="status" className="brand-sub" style={{marginTop:8}}></div>

        {loading ? (
          <div id="grid" className="grid" aria-live="polite">
            {Array.from({length:8}).map((_,i)=>(
              <div className="card skeleton" key={i}>
                <div className="img skel"></div>
                <div className="line skel"></div>
                <div className="line skel" style={{width:'60%'}}></div>
                <div className="line skel" style={{width:'40%'}}></div>
                <div className="line skel" style={{width:'80%'}}></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {plants.length === 0 ? (
              <div className="empty">No plants found. Try clearing filters.</div>
            ) : (
              <div id="grid" className="grid" aria-live="polite">
                {plants.map(p => (
                  <PlantCard
                    key={p._id || p.id}
                    plant={p}
                    onEdit={() => openEditModal(p)}
                    onDelete={() => handleDelete(p)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      <footer>
        <div className="footer-container">
          <span className="footer-brand">Urvann</span>
          <span id="count" className="footer-count">{plants.length} plant(s)</span>
        </div>
      </footer>

      {modalOpen && (
        <ModalForm
          plant={editPlant}
          onClose={() => { setModalOpen(false); setEditPlant(null); }}
          onSaved={() => {
            setToastMsg(editPlant ? 'Updated' : 'Added');
            setModalOpen(false);
            setEditPlant(null);
            loadPlants();
            loadSample();
          }}
        />
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
    </div>
  );
}
