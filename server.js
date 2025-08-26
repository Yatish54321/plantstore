/**
 * Urvann Mini Plant Store — Backend (APIs only)
 *
 * This file preserves all of your original backend logic and the seed data.
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// ---------- DB Setup ----------
let useMongo = true;
let PlantModel = null;

const PlantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  categories: { type: [String], required: true },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

async function initMongo() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  console.log("All ENV keys I see:", Object.keys(process.env));
  console.log("MONGODB_URI value is:", process.env.MONGODB_URI);
  if (!uri) {
    console.warn('[DB] MONGODB_URI not found in .env — using in-memory fallback');
    useMongo = false;
    return false;
  }
  try {
    console.log("[DB] Trying to connect to:", uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    PlantModel = mongoose.model('Plant', PlantSchema);
    console.log('[DB] ✅ Connected to MongoDB');
    useMongo = true;
    return true;
  } catch (err) {
    console.error('[DB] ❌ MongoDB connection failed:', err);
    useMongo = false;
    return false;
  }
}



// -------------------- Auto-seed MongoDB --------------------
async function autoSeedPlants() {
  if (!useMongo) return; // only seed if MongoDB is used
  try {
    const count = await PlantModel.countDocuments();
    if (count > 0) {
      console.log(`[Seed] Collection already has ${count} plants. Skipping seeding.`);
      return;
    }
    await PlantModel.insertMany(seedPlants);
    console.log(`[Seed] Inserted ${seedPlants.length} plants successfully!`);
  } catch (err) {
    console.error('[Seed] Error seeding plants:', err.message);
  }
}

// ---------- In-memory storage ----------
let memoryPlants = [];
let memoryId = 1;

// ---------- Seed plants ----------
const seedPlants = [
  { name: "Money Plant", price: 199, categories: ["Indoor", "Home Decor", "Air Purifying"], inStock: true },
  { name: "Snake Plant", price: 299, categories: ["Indoor", "Low Maintenance", "Air Purifying"], inStock: true },
  { name: "Areca Palm", price: 599, categories: ["Indoor", "Air Purifying"], inStock: true },
  { name: "Peace Lily", price: 349, categories: ["Indoor", "Flowering", "Air Purifying"], inStock: true },
  { name: "Spider Plant", price: 249, categories: ["Indoor", "Hanging", "Air Purifying"], inStock: true },
  { name: "ZZ Plant", price: 449, categories: ["Indoor", "Low Maintenance"], inStock: true },
  { name: "Aloe Vera", price: 199, categories: ["Succulent", "Medicinal", "Indoor"], inStock: true },
  { name: "Jade Plant", price: 299, categories: ["Succulent", "Indoor"], inStock: true },
  { name: "Rubber Plant", price: 399, categories: ["Indoor", "Home Decor"], inStock: true },
  { name: "Fiddle Leaf Fig", price: 899, categories: ["Indoor", "Home Decor"], inStock: false },
  { name: "Bougainvillea", price: 199, categories: ["Outdoor", "Flowering"], inStock: true },
  { name: "Hibiscus", price: 179, categories: ["Outdoor", "Flowering"], inStock: true },
  { name: "Rose (Desi)", price: 149, categories: ["Outdoor", "Flowering"], inStock: true },
  { name: "Marigold", price: 79, categories: ["Outdoor", "Flowering"], inStock: true },
  { name: "Tulsi", price: 69, categories: ["Outdoor", "Medicinal"], inStock: true },
  { name: "Chandni (Tabernaemontana)", price: 189, categories: ["Outdoor", "Flowering"], inStock: true },
  { name: "Ixora", price: 159, categories: ["Outdoor", "Flowering"], inStock: true },
  { name: "Croton", price: 229, categories: ["Outdoor", "Foliage"], inStock: true },
  { name: "Coleus", price: 129, categories: ["Outdoor", "Foliage"], inStock: true },
  { name: "Aglaonema", price: 349, categories: ["Indoor", "Foliage", "Low Maintenance"], inStock: true },
  { name: "Dieffenbachia", price: 329, categories: ["Indoor", "Foliage"], inStock: true },
  { name: "Lucky Bamboo (2 Layer)", price: 249, categories: ["Indoor", "Home Decor"], inStock: true },
  { name: "Lucky Bamboo (3 Layer)", price: 349, categories: ["Indoor", "Home Decor"], inStock: true },
  { name: "Syngonium", price: 199, categories: ["Indoor", "Foliage"], inStock: true },
  { name: "Pothos Neon", price: 219, categories: ["Indoor", "Hanging", "Air Purifying"], inStock: true },
  { name: "Philodendron Heartleaf", price: 299, categories: ["Indoor", "Hanging"], inStock: true },
  { name: "Sedum morganianum (Donkey Tail)", price: 399, categories: ["Succulent", "Hanging"], inStock: true },
  { name: "Echeveria Elegans", price: 249, categories: ["Succulent", "Indoor"], inStock: true },
  { name: "Kalanchoe Blossfeldiana", price: 279, categories: ["Succulent", "Flowering"], inStock: false },
  { name: "Cactus (Golden Barrel)", price: 349, categories: ["Succulent", "Outdoor"], inStock: true },
  { name: "Areca Palm (Large)", price: 1299, categories: ["Indoor", "Air Purifying"], inStock: true },
  { name: "Dracaena Marginata", price: 499, categories: ["Indoor", "Foliage"], inStock: true },
  { name: "Bamboo Palm", price: 549, categories: ["Indoor", "Air Purifying"], inStock: true },
  { name: "Boston Fern", price: 299, categories: ["Indoor", "Hanging"], inStock: false },
  { name: "Bird's Nest Fern", price: 349, categories: ["Indoor", "Foliage"], inStock: true },
  { name: "Areca Palm (Tabletop)", price: 449, categories: ["Indoor", "Air Purifying"], inStock: true },
  { name: "Jasmine (Mogra)", price: 219, categories: ["Outdoor", "Flowering", "Fragrant"], inStock: true },
  { name: "Champa (Plumeria)", price: 599, categories: ["Outdoor", "Flowering", "Fragrant"], inStock: true },
  { name: "Lavender", price: 449, categories: ["Outdoor", "Fragrant"], inStock: false },
  { name: "Basil (Sweet)", price: 129, categories: ["Edible", "Herb", "Outdoor"], inStock: true },
  { name: "Mint", price: 99, categories: ["Edible", "Herb", "Outdoor"], inStock: true },
  { name: "Curry Leaf", price: 149, categories: ["Edible", "Outdoor"], inStock: true },
  { name: "Adenium (Desert Rose)", price: 699, categories: ["Outdoor", "Succulent", "Flowering"], inStock: true },
  { name: "Ficus Bonsai (Ginseng)", price: 1599, categories: ["Indoor", "Home Decor", "Bonsai"], inStock: true },
  { name: "Banyan Bonsai (Ficus Microcarpa)", price: 1899, categories: ["Indoor", "Bonsai"], inStock: false },
  { name: "Rubber Plant (Variegated)", price: 599, categories: ["Indoor", "Foliage", "Home Decor"], inStock: true },
  { name: "Monstera Deliciosa", price: 999, categories: ["Indoor", "Home Decor", "Foliage"], inStock: true },
  { name: "Monstera Adansonii", price: 799, categories: ["Indoor", "Hanging", "Foliage"], inStock: true },
  { name: "Calathea Orbifolia", price: 699, categories: ["Indoor", "Foliage"], inStock: false },
  { name: "Calathea Medallion", price: 649, categories: ["Indoor", "Foliage"], inStock: true },
  { name: "String of Pearls", price: 549, categories: ["Succulent", "Hanging"], inStock: true },
  { name: "String of Hearts", price: 579, categories: ["Succulent", "Hanging"], inStock: true },
  { name: "Schefflera Arboricola", price: 399, categories: ["Indoor", "Foliage"], inStock: true }
];

async function ensureSeeded() {
  if (useMongo) {
    const count = await PlantModel.countDocuments();
    if (count === 0) {
      await PlantModel.insertMany(seedPlants);
      console.log('[DB] Seeded', seedPlants.length, 'plants');
    }
  } else {
    if (memoryPlants.length === 0) {
      memoryPlants = seedPlants.map(p => ({ id: String(memoryId++), ...p, createdAt: new Date() }));
      console.log('[MEM] Seeded', memoryPlants.length, 'plants');
    }
  }
}

// ---------- Helpers ----------
function normalizeCategories(cats) {
  if (!cats) return [];
  if (Array.isArray(cats)) return cats.map(c=>String(c).trim()).filter(Boolean);
  return String(cats).split(',').map(s=>s.trim()).filter(Boolean);
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function matchesSearch(p, term){
  const q = String(term || '').trim().toLowerCase();
  if(!q) return true;
  const name = (p.name || '').toLowerCase();
  const cats = (p.categories || []).map(c => String(c).toLowerCase());

  if (q.length === 1) {
    return name.startsWith(q) || cats.some(c => c.startsWith(q));
  }
  return name.includes(q) || cats.some(c => c.includes(q));
}

function matchesCategory(p, cat){
  if(!cat) return true;
  const q = String(cat).toLowerCase();
  return (p.categories||[]).some(c=>String(c).toLowerCase()===q);
}

const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}


try {
  const favicon = require('serve-favicon');
  const ico = path.join(__dirname, 'public', 'storelogo.ico');
  if (fs.existsSync(ico)) {
    app.use(favicon(ico));
  } else {
    console.log('[FAV] storelogo.ico not found in public/');
  }
} catch (e) {
  console.log('[FAV] serve-favicon not available or failed to setup', e.message || e);
}

// ---------- API Routes ----------
app.get('/api/health', (req,res)=>res.json({ok:true, mongo:useMongo}));

// List plants
app.get('/api/plants', async (req,res)=>{
  const { search='', category='', inStock } = req.query;
  const s = String(search || '').trim();

  try {
    let list = [];
    if(useMongo){
      const filters = {};
      if(inStock==='true'||inStock==='false') filters.inStock=inStock==='true';

      if (s) {
        if (s.length === 1) {
          // startsWith for 1-letter search
          const rStart = '^' + escapeRegex(s);
          filters.$or = [
            { name: { $regex: rStart, $options: 'i' } },
            { categories: { $elemMatch: { $regex: rStart, $options: 'i' } } }
          ];
        } else {
          // contains for multi-letter search
          const rAny = escapeRegex(s);
          filters.$or = [
            { name: { $regex: rAny, $options: 'i' } },
            { categories: { $elemMatch: { $regex: rAny, $options: 'i' } } }
          ];
        }
      }

      let docs = await PlantModel.find(filters).lean();
      list = docs.filter(p=>matchesCategory(p,category));
    } else {
      list = [...memoryPlants];
      if(inStock==='true'||inStock==='false'){ const want=inStock==='true'; list=list.filter(p=>!!p.inStock===want); }
      list = list.filter(p=>matchesSearch(p,s)).filter(p=>matchesCategory(p,category));
    }
    res.json({plants:list.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))});
  } catch(e){ console.error(e); res.status(500).json({error:'Failed to fetch plants'})}
});

// Sample plants grid
app.get('/api/plants/sample', async (req,res)=>{
  let list = useMongo ? await PlantModel.find().limit(6).lean() : memoryPlants.slice(0,6);
  res.json({plants:list});
});

// Support POST too (frontend calls POST sometimes)
app.post('/api/plants/sample', async (req,res)=>{
  let list = useMongo ? await PlantModel.find().limit(6).lean() : memoryPlants.slice(0,6);
  res.json({plants:list});
});

// Add plant
app.post('/api/plants', async (req,res)=>{
  try{
    const { name, price, categories, inStock } = req.body;
    if(!name||name.trim().length<2) return res.status(400).json({error:'Name min 2 chars'});
    const priceNum=Number(price); if(Number.isNaN(priceNum)||priceNum<0) return res.status(400).json({error:'Valid price required'});
    const cats=normalizeCategories(categories); if(!cats.length) return res.status(400).json({error:'At least 1 category'});
    const stock=Boolean(inStock);
    if(useMongo){
      const created = await PlantModel.create({name:name.trim(), price:priceNum, categories:cats, inStock:stock});
      res.status(201).json({plant:created});
    } else {
      const created={id:String(memoryId++),name:name.trim(),price:priceNum,categories:cats,inStock:stock,createdAt:new Date()};
      memoryPlants.unshift(created);
      res.status(201).json({plant:created});
    }
  } catch(e){ console.error(e); res.status(500).json({error:'Failed to add plant'})}
});

// Edit plant
app.put('/api/plants/:id', async (req,res)=>{
  try{
    const { name, price, categories, inStock } = req.body;
    const cats=normalizeCategories(categories);
    if(useMongo){
      const updated = await PlantModel.findByIdAndUpdate(req.params.id,{name:name.trim(), price:Number(price), categories:cats, inStock:Boolean(inStock)},{new:true});
      if(!updated) return res.status(404).json({error:'Not found'});
      res.json({plant:updated});
    } else {
      const idx=memoryPlants.findIndex(p=>p.id===req.params.id);
      if(idx===-1) return res.status(404).json({error:'Not found'});
      memoryPlants[idx]={...memoryPlants[idx], name:name.trim(), price:Number(price), categories:cats, inStock:Boolean(inStock)};
      res.json({plant:memoryPlants[idx]});
    }
  } catch(e){ console.error(e); res.status(500).json({error:'Failed to update plant'})}
});

// Delete plant
app.delete('/api/plants/:id', async (req,res)=>{
  try{
    if(useMongo){
      const deleted = await PlantModel.findByIdAndDelete(req.params.id);
      if(!deleted) return res.status(404).json({error:'Not found'});
      res.json({ok:true});
    } else {
      memoryPlants = memoryPlants.filter(p=>p.id!==req.params.id);
      res.json({ok:true});
    }
  } catch(e){ console.error(e); res.status(500).json({error:'Failed to delete plant'})}
});

// Categories
app.get('/api/categories', async (req,res)=>{
  try{
    let cats = new Set();
    const list = useMongo ? await PlantModel.find({}, {categories:1,_id:0}).lean() : memoryPlants;
    list.forEach(p=> (p.categories||[]).forEach(c=>cats.add(c)));
    res.json({categories:Array.from(cats).sort()});
  } catch(e){ res.status(500).json({error:'Failed'})}
});

// ---------- Serve React build if present ----------
const clientBuildPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    // keep API routes functioning
    if (req.path.startsWith('/api')) return res.status(404).json({error:'Not found'});
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // root landing to confirm API is running
  app.get('/', (req,res) => res.send('Urvann API running. Build the React client in /client and run `npm run build` to serve frontend.'));
}

// ---------- Init ----------
(async () => {
  await initMongo();         // connect to MongoDB first
  await autoSeedPlants();    // Auto-seed if collection is empty (Mongo only)
  await ensureSeeded();      // seed DB if needed (also memory fallback)
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();
