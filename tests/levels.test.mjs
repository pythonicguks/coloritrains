// Checks every level: well-formed map, and the reference rails bring every train to its own
// station (with its word, in order, for the word series). Run: node tests/levels.test.mjs
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const core=html.split('// ===== CORE START =====')[1].split('// ===== CORE END =====')[0];
const {LEVELS,WORD_LEVELS,parseLevel,trace,traceAll,nameLevel,cleanName,COLS,ROWS}=
  new Function(core+';return {LEVELS,WORD_LEVELS,parseLevel,trace,traceAll,nameLevel,cleanName,COLS,ROWS};')();

const empty=()=>[...Array(ROWS)].map(()=>Array(COLS).fill(null));

function check(def,name){
  assert.equal(def.map.length,ROWS,`${name}: ${ROWS} lignes`);
  def.map.forEach(l=>assert.equal(l.split(' ').length,COLS,`${name}: "${l}"`));
  if(def.wag){
    assert.equal(def.wag.length,ROWS,`${name}: wagons, ${ROWS} lignes`);
    def.wag.forEach(l=>assert.equal(l.split(' ').length,COLS,`${name}: wagons "${l}"`));
  }
  const lv=parseLevel(def);
  assert.equal(lv.trains.filter(Boolean).length,def.trains.length,`${name}: trains placés`);
  assert.equal(lv.stations.filter(Boolean).length,def.stations.length,`${name}: gares placées`);
  const keys=t=>t.map(x=>x.key).sort().join();
  assert.equal(keys(lv.trains),keys(lv.stations),`${name}: une gare par train`);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const p=lv.solution[r][c];
    if(p)assert.ok(def.pieces.includes(p),`${name}: pièce ${p} absente du bac`);
    if(lv.wagons[r][c])assert.ok(!lv.fixed[r][c]||lv.fixed[r][c].type==='rail',`${name}: wagon sur une case occupée (${c},${r})`);
  }
  const used=new Set();
  traceAll(lv,lv.solution).forEach((res,i)=>{
    const t=lv.trains[i], st=lv.stations[res.station];
    assert.ok(res.ok,`${name}: le train ${t.key} n'arrive pas (${res.letters.map(x=>x.l).join('')})`);
    if(st.word)assert.equal(res.letters.map(x=>x.l).join(''),st.word);
    for(const s of res.segs.slice(1,-1))used.add(s.c+','+s.r);
  });
  let total=0;for(const row of lv.solution)for(const p of row)if(p)total++;
  assert.equal(used.size,total,`${name}: rails inutiles dans la solution`);
  let toPlace=0;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(lv.solution[r][c]&&!lv.fixed[r][c])toPlace++;
  // Nothing placed: no train may arrive by accident.
  for(const t of lv.trains)assert.ok(!trace(lv,empty(),t.idx).ok,`${name}: résolu sans rails`);
  return {lv,toPlace};
}

assert.equal(LEVELS.length,10);
LEVELS.forEach((def,i)=>{const {lv,toPlace}=check(def,`niveau ${i+1}`);console.log(`ok niveau ${i+1} (${def.theme}, ${lv.trains.length} trains, ${toPlace} rails)`);});

assert.equal(WORD_LEVELS.length,10);
WORD_LEVELS.forEach((def,i)=>{
  const {lv,toPlace}=check(def,`mots ${i+1}`);
  let extra=0;for(const row of lv.wagons)for(const w of row)if(w)extra++;
  extra-=lv.stations.reduce((n,s)=>n+[...s.word].length,0);
  console.log(`ok mots ${i+1} (${lv.stations.map(s=>s.word).join(' + ')}, ${toPlace} rails, ${extra} wagons en trop)`);
});

// A wrong order must fail: on "mots 2" (LIT), going down first hooks T before L and I.
{
  const lv=parseLevel(WORD_LEVELS[1]), g=empty();
  g[3][1]='sw';g[4][1]='v';g[5][1]='ne';g[5][2]='h';g[5][3]='h';
  const res=trace(lv,g,0);
  assert.equal(res.letters.map(x=>x.l).join(''),'T');
  assert.ok(!res.ok,'mauvais ordre accepté');
}

assert.equal(cleanName(' marie-lou '),'MARIELOU');
assert.equal(cleanName('Zoé'),'ZOÉ');
for(const n of ['LÉO','MAXIMILIEN','ALEXANDRE','ZOÉ','A',cleanName('Anne-Charlotte Victoria')]){
  const {toPlace}=check(nameLevel(n),`prénom ${n}`);
  console.log(`ok prénom ${n} (${toPlace} rails à poser)`);
}
