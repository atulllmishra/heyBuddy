/**
 * Distributed Telemetry & Counter Engine (YouTube-Grade Architecture)
 * 
 * Features:
 * 1. Redis-Style In-Memory Key-Value Store (Atomic INCR/HSET)
 * 2. 64-Register HyperLogLog (HLL) Probabilistic Cardinality Estimator
 * 3. Multi-Region Conflict-Free Replicated Data Type (CRDT) G-Counter
 * 4. Google Cloud Bigtable / Spanner Persistent Audit Store Simulation
 * 5. Write-Behind Batch Flusher Worker
 */

const crypto = require('crypto');

// 1. HyperLogLog (HLL) 64-Register Unique Cardinality Estimator
class HyperLogLog {
  constructor(registers = 64) {
    this.m = registers;
    this.registers = new Uint8Array(this.m);
    // Alpha correction constant for m = 64
    this.alpha = 0.709;
  }

  _hash(val) {
    const hashHex = crypto.createHash('md5').update(String(val)).digest('hex');
    return parseInt(hashHex.substring(0, 8), 16);
  }

  add(val) {
    const hash = this._hash(val);
    // Determine register index using first 6 bits (2^6 = 64)
    const idx = hash & (this.m - 1);
    // Count leading zeros in remaining bits + 1
    const remaining = hash >> 6;
    let rho = 1;
    let temp = remaining;
    while (temp > 0 && (temp & 1) === 0 && rho <= 32) {
      rho++;
      temp >>= 1;
    }
    this.registers[idx] = Math.max(this.registers[idx], rho);
  }

  count() {
    let sum = 0;
    let zeroRegisters = 0;
    for (let i = 0; i < this.m; i++) {
      const val = this.registers[i];
      sum += Math.pow(2, -val);
      if (val === 0) zeroRegisters++;
    }

    let estimate = this.alpha * this.m * this.m * (1 / sum);

    // Small range correction for zero registers
    if (estimate <= 2.5 * this.m && zeroRegisters > 0) {
      estimate = this.m * Math.log(this.m / zeroRegisters);
    }
    return Math.round(estimate);
  }
}

// 2. Multi-Region CRDT G-Counter (Grow-Only Conflict-Free Replicated Counter)
class CRDTGCounter {
  constructor(nodeNames = ['us-east-1', 'eu-central-1', 'ap-south-1']) {
    this.P = {};
    nodeNames.forEach(node => { this.P[node] = 0; });
  }

  increment(node = 'us-east-1', amount = 1) {
    if (this.P[node] !== undefined) {
      this.P[node] += amount;
    } else {
      this.P[node] = amount;
    }
  }

  value() {
    return Object.values(this.P).reduce((sum, val) => sum + val, 0);
  }

  merge(otherCounter) {
    for (const node in otherCounter.P) {
      this.P[node] = Math.max(this.P[node] || 0, otherCounter.P[node]);
    }
  }
}

// 3. Redis-Style In-Memory Data Store (Key-Value & Hash Accumulator)
class RedisInMemoryStore {
  constructor() {
    this.counters = new Map();
    this.hashes = new Map();
    this.hllStores = new Map();
    this.gCounters = new Map();
  }

  incr(key, amount = 1) {
    const current = this.counters.get(key) || 0;
    const next = current + amount;
    this.counters.set(key, next);
    return next;
  }

  decr(key, amount = 1) {
    const current = this.counters.get(key) || 0;
    const next = Math.max(0, current - amount);
    this.counters.set(key, next);
    return next;
  }

  get(key, defaultValue = 0) {
    return this.counters.get(key) !== undefined ? this.counters.get(key) : defaultValue;
  }

  hset(hashKey, field, val) {
    if (!this.hashes.has(hashKey)) {
      this.hashes.set(hashKey, new Map());
    }
    this.hashes.get(hashKey).set(field, val);
  }

  hget(hashKey, field) {
    if (!this.hashes.has(hashKey)) return null;
    return this.hashes.get(hashKey).get(field) || null;
  }

  getHLL(key) {
    if (!this.hllStores.has(key)) {
      this.hllStores.set(key, new HyperLogLog(64));
    }
    return this.hllStores.get(key);
  }

  getGCounter(key) {
    if (!this.gCounters.has(key)) {
      this.gCounters.set(key, new CRDTGCounter());
    }
    return this.gCounters.get(key);
  }
}

const fs = require('fs');
const path = require('path');

const DB_FILE_PATH = path.join(__dirname, '../data/telemetry_db.json');

// Ensure server/data directory exists
const dbDir = path.dirname(DB_FILE_PATH);
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (e) {}
}

// 4. Cloud Bigtable / Spanner Persistent Storage Engine Simulation with File DB Persistence
class BigtablePersistentStore {
  constructor() {
    this.tables = new Map();
    this._loadFromDisk();
  }

  _loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(([vId, rec]) => {
            this.tables.set(vId, rec);
          });
        }
      }
    } catch (err) {
      console.warn('[BigtableStore] Disk load warning:', err.message);
    }
  }

  _saveToDisk() {
    try {
      const data = Array.from(this.tables.entries());
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('[BigtableStore] Disk save error:', err.message);
    }
  }

  getRecord(videoId) {
    if (!this.tables.has(videoId)) {
      const initialRecord = {
        videoId,
        auditedViews: 0,
        auditedLikes: 0,
        auditedDislikes: 0,
        subscribers: 0,
        liveStudents: 0,
        lastFlushedAt: new Date().toISOString()
      };
      this.tables.set(videoId, initialRecord);
      this._saveToDisk();
    }
    return this.tables.get(videoId);
  }

  updateRecord(videoId, updates) {
    const rec = this.getRecord(videoId);
    Object.assign(rec, updates, { lastFlushedAt: new Date().toISOString() });
    this.tables.set(videoId, rec);
    this._saveToDisk();
    return rec;
  }
}

// Singleton Service Instances
const redisCache = new RedisInMemoryStore();
const bigtableStore = new BigtablePersistentStore();

// Ingestion Ring-Buffer Queue
const eventIngestQueue = [];

// Write-Behind Worker (Flushes accumulated Redis in-memory deltas to Bigtable every 5s)
setInterval(() => {
  if (eventIngestQueue.length === 0) return;

  const batch = eventIngestQueue.splice(0, eventIngestQueue.length);
  const aggregatedByVideo = {};

  batch.forEach(evt => {
    const vId = evt.videoId || 'default_video';
    if (!aggregatedByVideo[vId]) {
      aggregatedByVideo[vId] = { views: 0, likes: 0, dislikes: 0, subDelta: 0 };
    }

    if (evt.type === 'view') aggregatedByVideo[vId].views += 1;
    if (evt.type === 'like') aggregatedByVideo[vId].likes += (evt.action === 'remove' ? -1 : 1);
    if (evt.type === 'dislike') aggregatedByVideo[vId].dislikes += (evt.action === 'remove' ? -1 : 1);
    if (evt.type === 'subscribe') aggregatedByVideo[vId].subDelta += (evt.action === 'unsubscribe' ? -1 : 1);
  });

  // Flush to Bigtable persistent store & save to disk
  Object.keys(aggregatedByVideo).forEach(vId => {
    const deltas = aggregatedByVideo[vId];
    const record = bigtableStore.getRecord(vId);
    bigtableStore.updateRecord(vId, {
      auditedViews: Math.max(0, record.auditedViews + deltas.views),
      auditedLikes: Math.max(0, record.auditedLikes + deltas.likes),
      auditedDislikes: Math.max(0, record.auditedDislikes + deltas.dislikes),
      subscribers: Math.max(0, record.subscribers + deltas.subDelta)
    });
  });
}, 5000);

module.exports = {
  redisCache,
  bigtableStore,
  eventIngestQueue,
  HyperLogLog,
  CRDTGCounter
};
