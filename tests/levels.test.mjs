// Checks every level: well-formed map, and the reference rails bring every train to its own station.
// Run: node tests/levels.test.mjs
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const core=html.split('// ===== CORE START =====')[1].split('// ===== CORE END =====')[0];
const {LEVELS,parseLevel,trace,COLS,ROWS,CHAR2PIECE}=new Function(core+';return {LEVELS,parseLevel,trace,COLS,ROWS,CHAR2PIECE};')();

assert.equal(LEVELS.length,10);
LEVELS.forEach((def,i)=>{
  const name=`niveau ${i+1}`;
  assert.equal(def.map.length,ROWS,`${name}: ${ROWS} lignes`);
  def.map.forEach(l=>assert.equal(l.split(' ').length,COLS,`${name}: "${l}"`));
  const lv=parseLevel(def);
  assert.equal(lv.trains.filter(Boolean).length,def.trains.length,`${name}: trains placés`);
  assert.equal(lv.stations.filter(Boolean).length,def.stations.length,`${name}: gares placées`);
  const keys=t=>t.map(x=>x.key).sort().join();
  assert.equal(keys(lv.trains),keys(lv.stations),`${name}: une gare par train`);
  for(const row of lv.solution)for(const p of row)if(p)assert.ok(def.pieces.includes(p),`${name}: pièce ${p} absente du plateau`);
  const used=new Set();
  for(const t of lv.trains){
    const res=trace(lv,lv.solution,t.idx);
    assert.ok(res.ok,`${name}: le train ${t.key} n'arrive pas`);
    for(const s of res.segs.slice(1,-1))used.add(s.c+','+s.r);
  }
  let total=0;for(const row of lv.solution)for(const p of row)if(p)total++;
  assert.equal(used.size,total,`${name}: rails inutiles dans la solution`);
  // Nothing placed: no train may arrive by accident.
  const empty=[...Array(ROWS)].map(()=>Array(COLS).fill(null));
  for(const t of lv.trains)assert.ok(!trace(lv,empty,t.idx).ok,`${name}: résolu sans rails`);
  console.log(`ok ${name} (${def.theme}, ${lv.trains.length} trains, ${total} rails)`);
});
