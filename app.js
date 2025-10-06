
(function(){
  const TYPES=["ノーマル","ほのお","みず","でんき","くさ","こおり","かくとう","どく","じめん","ひこう","エスパー","むし","いわ","ゴースト","ドラゴン","あく","はがね","フェアリー"];
  const TYPE_CHART={
    "ノーマル":{"いわ":0.5,"はがね":0.5,"ゴースト":0},
    "ほのお":{"くさ":2,"こおり":2,"むし":2,"はがね":2,"ほのお":0.5,"みず":0.5,"いわ":0.5,"ドラゴン":0.5},
    "みず":{"ほのお":2,"じめん":2,"いわ":2,"みず":0.5,"くさ":0.5,"ドラゴン":0.5},
    "でんき":{"みず":2,"ひこう":2,"でんき":0.5,"くさ":0.5,"ドラゴン":0.5,"じめん":0},
    "くさ":{"みず":2,"じめん":2,"いわ":2,"ほのお":0.5,"くさ":0.5,"どく":0.5,"ひこう":0.5,"むし":0.5,"ドラゴン":0.5,"はがね":0.5},
    "こおり":{"くさ":2,"じめん":2,"ひこう":2,"ドラゴン":2,"ほのお":0.5,"みず":0.5,"こおり":0.5,"はがね":0.5},
    "かくとう":{"ノーマル":2,"こおり":2,"いわ":2,"あく":2,"はがね":2,"どく":0.5,"ひこう":0.5,"エスパー":0.5,"むし":0.5,"フェアリー":0.5,"ゴースト":0},
    "どく":{"くさ":2,"フェアリー":2,"どく":0.5,"じめん":0.5,"いわ":0.5,"ゴースト":0.5,"はがね":0},
    "じめん":{"ほのお":2,"でんき":2,"どく":2,"いわ":2,"はがね":2,"くさ":0.5,"むし":0.5,"ひこう":0},
    "ひこう":{"くさ":2,"かくとう":2,"むし":2,"でんき":0.5,"いわ":0.5,"はがね":0.5},
    "エスパー":{"かくとう":2,"どく":2,"エスパー":0.5,"はがね":0.5,"あく":0},
    "むし":{"くさ":2,"エスパー":2,"あく":2,"ほのお":0.5,"かくとう":0.5,"どく":0.5,"ひこう":0.5,"ゴースト":0.5,"はがね":0.5,"フェアリー":0.5},
    "いわ":{"ほのお":2,"こおり":2,"ひこう":2,"むし":2,"かくとう":0.5,"じめん":0.5,"はがね":0.5},
    "ゴースト":{"エスパー":2,"ゴースト":2,"あく":0.5,"ノーマル":0},
    "ドラゴン":{"ドラゴン":2,"はがね":0.5,"フェアリー":0},
    "あく":{"エスパー":2,"ゴースト":2,"かくとう":0.5,"あく":0.5,"フェアリー":0.5},
    "はがね":{"こおり":2,"いわ":2,"フェアリー":2,"ほのお":0.5,"みず":0.5,"でんき":0.5,"はがね":0.5},
    "フェアリー":{"かくとう":2,"ドラゴン":2,"あく":2,"ほのお":0.5,"どく":0.5,"はがね":0.5}
  };
  const NATURES={"いじっぱり":{atk:1.1,spa:0.9},"ようき":{spe:1.1,spa:0.9},"おくびょう":{spe:1.1,atk:0.9},"ひかえめ":{spa:1.1,atk:0.9},"ずぶとい":{def:1.1,atk:0.9},"おだやか":{spd:1.1,atk:0.9},"てれや":{}};

  const moveDB={list:[]};
  const pokeDB={map:new Map(), displayNames:[]};
  const buildDB={raw:null, teams:[]};

  function normName(s){return (s||'').toString().trim().replace(/[\\s・]/g,'').toLowerCase();}

  async function loadData(){
    try{ moveDB.list=await fetch("./data/moves.min.json",{cache:"no-store"}).then(r=>r.json()); }catch(e){ moveDB.list=[]; }
    try{
      const pk = await fetch("./data/pokemon_master.json",{cache:"no-store"}).then(r=>r.json());
      const arr = Array.isArray(pk)? pk : (pk.pokemon||pk.data||[]);
      const dispSet = new Set();
      arr.forEach(p=>{
        const name = (p["名前"]||p["日本語名"]||p["name"]||p["jp"]||"").toString().trim();
        if(!name) return;
        const t1 = (p["タイプ1"]||"").toString().trim();
        const t2raw = p.hasOwnProperty("タイプ2") ? p["タイプ2"] : "";
        const t2 = (t2raw===null || typeof t2raw==="undefined") ? "" : (""+t2raw).trim();
        const base = { hp:+(p["HP"]||0), atk:+(p["攻撃"]||0), def:+(p["防御"]||0), spa:+(p["特攻"]||0), spd:+(p["特防"]||0), spe:+(p["素早"]||0) };
        const types = (t2? [t1,t2] : [t1]).filter(Boolean);
        pokeDB.map.set(name,{types,base});
        dispSet.add(name);
        const nn = normName(name);
        if(!pokeDB.map.has(nn)) pokeDB.map.set(nn,{types,base});
      });
      pokeDB.displayNames = Array.from(dispSet).sort();
      const c = document.querySelector("#data_counts");
      if(c){ c.textContent = `データ: ポケモン ${pokeDB.displayNames.length} / 技 ${moveDB.list.length}`; }
    }catch(e){ console.error(e); }
  }

  function toStat(base,iv,ev,lv,nMul,isHP=false){
    base=Number(base||0); iv=Number(iv||31); ev=Number(ev||0); lv=Number(lv||50); nMul=Number(nMul||1);
    if(isHP) return Math.floor(((2*base+iv+Math.floor(ev/4))*lv)/100)+lv+10;
    const s=Math.floor(((2*base+iv+Math.floor(ev/4))*lv)/100)+5; return Math.floor(s*nMul);
  }
  function natureMul(stat,nat){ const n=NATURES[nat]||{}; if(n[stat]>1) return 1.1; if(n[stat]&&n[stat]<1) return 0.9; return 1.0; }
  function typeEffect(moveType,defTypes){ let m=1.0; (defTypes||[]).forEach(t=>{ const row=TYPE_CHART[moveType]||{}; m*=(row[t]||1.0); }); return m; }
  function stabMultiplier(attTypes,teraType,moveType){ const has=attTypes.includes(moveType); if(teraType&&teraType===moveType){ return attTypes.includes(teraType)?2.0:1.5; } return has?1.5:1.0; }
  function weatherMul(w,m){ if(w==="雨"){ if(m==="みず")return 1.5; if(m==="ほのお")return 0.5;} if(w==="晴れ"){ if(m==="ほのお")return 1.5; if(m==="みず")return 0.5;} return 1.0; }
  function itemMul(item,cat){ if(!item) return 1.0; if(/こだわりハチマキ/.test(item)&&cat==="物理")return 1.5; if(/こだわりメガネ/.test(item)&&cat==="特殊")return 1.5; if(/いのちのたま/.test(item))return 1.3; return 1.0; }
  function abilityMul(ab,mt,cat){ if(!ab) return 1.0; if(/てきおうりょく/.test(ab)) return 1.33; if(/もらいび/.test(ab)&&mt==="ほのお")return 1.5; return 1.0; }

  function calcDamage(ctx){
    const L=Number(ctx.level||50), A=ctx.category==="物理"?ctx.atk:ctx.spa, D=ctx.category==="物理"?ctx.def:ctx.spd;
    const BP=Math.max(1,Number(ctx.power||0)); const base=Math.floor(Math.floor((2*L/5+2)*BP*A/Math.max(1,D))/50)+2;
    let mod=1.0; mod*=stabMultiplier(ctx.attackerTypes||[],ctx.teraType,ctx.moveType); mod*=typeEffect(ctx.moveType,ctx.defenderTypes||[]); mod*=weatherMul(ctx.weather,ctx.moveType);
    if(ctx.critical) mod*=1.5; if(ctx.burn&&ctx.category==="物理") mod*=0.5; mod*=itemMul(ctx.item,ctx.category); mod*=abilityMul(ctx.ability,ctx.moveType,ctx.category); if(ctx.screen) mod*= (ctx.format==="ダブル"? 2/3 : 0.5);
    const min=Math.floor(base*mod*0.85), max=Math.floor(base*mod*1.00); return [min,max];
  }

  function buildDatalist(id, arr){
    const dl=document.createElement('datalist'); dl.id=id;
    const frag=document.createDocumentFragment();
    arr.forEach(v=>{ const o=document.createElement('option'); o.value=v; frag.appendChild(o); });
    dl.appendChild(frag); document.body.appendChild(dl);
  }

  function moveByName(n){ n=(n||'').trim(); return moveDB.list.find(m=>(m.n||m.name)===n); }
  function pokeInfo(n){
    const key=(n||'').trim();
    return pokeDB.map.get(key) || pokeDB.map.get(normName(key));
  }

  function statBlock(name,evs,nature,lv=50,iv=31){
    const info=pokeInfo(name); if(!info||!info.base||Object.keys(info.base).length===0) return {_unknown:true,types:[],hp:1,atk:1,def:1,spa:1,spd:1,spe:1};
    const b=Object.assign({hp:1,atk:1,def:1,spa:1,spd:1,spe:1}, info.base||{});
    return {
      hp:toStat(b.hp,iv,evs.hp||0,lv,1.0,true),
      atk:toStat(b.atk,iv,evs.atk||0,lv,natureMul('atk',nature)),
      def:toStat(b.def,iv,evs.def||0,lv,natureMul('def',nature)),
      spa:toStat(b.spa,iv,evs.spa||0,lv,natureMul('spa',nature)),
      spd:toStat(b.spd,iv,evs.spd||0,lv,natureMul('spd',nature)),
      spe:toStat(b.spe,iv,evs.spe||0,lv,natureMul('spe',nature)),
      types:info.types||[]
    };
  }

  function presetEV(name){ const m={"H252B252":{hp:252,def:252,spd:4},"H252D252":{hp:252,spd:252,def:4},"A252S252":{atk:252,spe:252,hp:4},"C252S252":{spa:252,spe:252,hp:4}}; return m[name]||{hp:0,atk:0,def:0,spa:0,spd:0,spe:0}; }
  function q(s,r){return (r||document).querySelector(s)}; function qa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function applyTypeChips(panel, types){ const box = q('[data-typechips]', panel); if(!box) return; box.innerHTML = ""; (types||[]).forEach(t=>{ const span=document.createElement('span'); span.className='chip'; span.textContent=t; box.appendChild(span); }); }

  function bestMoveDamage(att,def,env,moves){
    let best=[0,0], name="";
    for(const mvName of moves){
      const mv=moveByName(mvName); if(!mv) continue; if(mv.c==="変化"||!mv.p) continue;
      const ctx={level:env.level||50, atk:att.atk, spa:att.spa, def:def.def, spd:def.spd, power:mv.p, category:mv.c, moveType:mv.t, attackerTypes:att.types, defenderTypes:def.types,
        teraType:env.teraType||null, weather:env.weather||null, critical:env.critical||false, burn:false, item:env.item||null, ability:env.ability||null, screen:env.screen||false, format:'シングル'};
      const dmg=calcDamage(ctx); if(dmg[1]>best[1]){ best=dmg; name=mvName; }
    }
    return {dmg:best, name};
  }

  function showTab(id){ qa('.tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.tab===id?'true':'false')); qa('.panel').forEach(p=>p.setAttribute('aria-hidden',p.id===id?'false':'true')); }

  function TYPES_HTML(){return TYPES.map(t=>`<option>${t}</option>`).join("")}
  function moveRowHTML(i){return `<div class="row"><label>技${i}</label><input type="text" data-move-input placeholder="技名"/><select data-move-type><option value="">タイプ</option>${TYPES_HTML()}</select><select data-move-cat><option value="">分類</option><option>物理</option><option>特殊</option><option>変化</option></select><input type="number" data-move-pow placeholder="威力"/></div>`}
  function cardTemplate(side,idx){
    return `<div class="card panel" style="display:block" data-side="${side}" data-slot="${idx}">
      <div class="row"><label>名前</label><input type="text" data-poke-input placeholder="ポケモン"/><div class="chips" data-typechips></div></div>
      <div class="row"><label>性格</label><select data-nature><option>てれや</option><option>いじっぱり</option><option>ようき</option><option>ひかえめ</option><option>おくびょう</option><option>ずぶとい</option><option>おだやか</option></select></div>
      <div class="row"><span class="pill">EV</span><input type="number" data-ev-hp placeholder="H" value="0"/><input type="number" data-ev-atk placeholder="A" value="0"/><input type="number" data-ev-def placeholder="B" value="0"/><input type="number" data-ev-spa placeholder="C" value="0"/><input type="number" data-ev-spd placeholder="D" value="0"/><input type="number" data-ev-spe placeholder="S" value="0"/>
      <button class="btn" data-ev-preset="A252S252">A252S252</button><button class="btn" data-ev-preset="C252S252">C252S252</button><button class="btn" data-ev-preset="H252B252">H252B252</button><button class="btn" data-ev-preset="H252D252">H252D252</button></div>
      ${side==="self"||side==="party"? (moveRowHTML(1)+moveRowHTML(2)+moveRowHTML(3)+moveRowHTML(4)) : ""}
    </div>`;
  }

  function buildSix(){
    const selfWrap=q('#self .cards'), oppWrap=q('#opp .cards');
    for(let i=1;i<=6;i++){ selfWrap.insertAdjacentHTML('beforeend', cardTemplate('self', i)); }
    for(let i=1;i<=6;i++){ oppWrap.insertAdjacentHTML('beforeend', cardTemplate('opp', i)); }
  }
  function buildParty(){
    const pw=q('#party .cards');
    for(let i=1;i<=6;i++){ pw.insertAdjacentHTML('beforeend', cardTemplate('party', i)); }
  }
  function buildBuildTab(){ /* populated after import */ }

  function wireCommonInputs(root){
    root.querySelectorAll('[data-move-input]').forEach(inp=>{
      inp.setAttribute('list','dl_moves');
      inp.addEventListener('change',()=>{
        const row=inp.closest('.row'), mv=moveByName(inp.value);
        if(mv&&row){ const t=row.querySelector('[data-move-type]'), c=row.querySelector('[data-move-cat]'), p=row.querySelector('[data-move-pow]');
          if(t&&!t.value) t.value=mv.t||''; if(c&&!c.value) c.value=mv.c||''; if(p&&(!p.value||p.value==='0')) p.value=mv.p||0;
        }
      });
    });
    root.querySelectorAll('[data-poke-input]').forEach(inp=>{
      inp.setAttribute('list','dl_pokemon');
      inp.addEventListener('change',()=>{
        const card=inp.closest('.card'); const info=pokeInfo(inp.value||"");
        applyTypeChips(card, (info&&info.types)||[]);
      });
    });
    root.querySelectorAll('[data-ev-preset]').forEach(btn=> btn.addEventListener('click',()=>{
      const row=btn.closest('.row'); const m={"H252B252":{hp:252,def:252,spd:4},"H252D252":{hp:252,spd:252,def:4},"A252S252":{atk:252,spe:252,hp:4},"C252S252":{spa:252,spe:252,hp:4}}[btn.dataset.evPreset];
      ['hp','atk','def','spa','spd','spe'].forEach(k=>{ const el=row.parentElement.querySelector('[data-ev-'+k+']'); if(el) el.value=(m&&m[k])||0; });
    }));
  }

  function build(){
    document.querySelectorAll('.tab').forEach(t=> t.addEventListener('click',()=>showTab(t.dataset.tab))); showTab('build');
    buildDatalist('dl_moves', (moveDB.list.map(m=>m.n||m.name).filter(Boolean).sort()));
    buildDatalist('dl_pokemon', pokeDB.displayNames);
    buildSix(); wireCommonInputs(document);
    buildParty(); wireCommonInputs(q('#party'));
    buildBuildTab();

    const fi=q('#team_file'), bt=q('#btn_team_import');
    if(fi&&bt){
      bt.addEventListener('click', ()=>fi.click());
      fi.addEventListener('change', ev=>{
        const file=ev.target.files[0]; if(!file) return;
        const rd=new FileReader(); rd.onload=()=>{
          try{
            const data=JSON.parse(rd.result); const team=(data.team||(Array.isArray(data)&&data[0]&&data[0].team)||[]).slice(0,6);
            const cards=Array.from(document.querySelectorAll('#opp .card'));
            team.forEach((p,i)=>{ if(cards[i]){ const name=(p.name||p.pokemon||p["ポケモン"]||"").trim(); const input=cards[i].querySelector('[data-poke-input]'); if(input){ input.value=name; input.dispatchEvent(new Event('change',{bubbles:true})); }}});
          }catch(e){ alert('JSONの形式を読み取れませんでした'); }
        }; rd.readAsText(file,'utf-8');
      });
    }

    q('#btn_build_import').addEventListener('click', ()=> q('#build_import_file').click());
    q('#build_import_file').addEventListener('change', onBuildImport);
    q('#build_rank_max').addEventListener('input', refreshBuildList);
    q('#build_search').addEventListener('input', refreshBuildList);
  }

  function onBuildImport(ev){
    const file=ev.target.files[0]; if(!file) return;
    const rd=new FileReader(); rd.onload=()=>{
      try{
        const json=JSON.parse(rd.result);
        buildDB.raw=json;
        buildDB.teams=parseBuild(json);
        refreshBuildList();
        showTab('build');
      }catch(e){ alert('構築記事JSONの読み取りに失敗しました'); }
    };
    rd.readAsText(file,'utf-8');
  }

  function parseBuild(json){
    let arr=[];
    if(Array.isArray(json)) arr=json;
    else if(json.teams) arr=json.teams;
    else if(json.data) arr=json.data;
    else if(json.list) arr=json.list;
    if(arr.length===0){
      const keys=Object.keys(json||{});
      for(const k of keys){
        if(Array.isArray(json[k]) && json[k].length && (json[k][0].team || json[k][0].members || json[k][0].pokemon)){
          arr=json[k]; break;
        }
      }
    }
    const teams=[];
    arr.forEach((rec,idx)=>{
      const rawTeam = rec.team || rec.members || rec.pokemon || rec.party || rec["チーム"] || rec["構築"] || rec["パーティ"] || rec["ポケモン"];
      const list = Array.isArray(rawTeam) ? rawTeam : (Array.isArray(rec) ? rec : []);
      const rank = rec.rank || rec.Rank || rec["順位"] || (rec.place) || (idx+1);
      const mons = list.slice(0,6).map(m=>{
        const name=(m.name||m.pokemon||m["ポケモン"]||m["name_ja"]||"").toString().trim();
        const item=(m.item||m["持ち物"]||"")+"";
        const tera=(m.tera||m.terastal||m["テラス"]||"")+"";
        return {name,item,tera};
      });
      if(mons.length){
        teams.push({rank:Number(rank)||idx+1, mons});
      }
    });
    return teams;
  }

  function refreshBuildList(){
    const wrap=q('#build_cards'); if(!wrap) return; wrap.innerHTML="";
    const limit=Number(q('#build_rank_max').value||100);
    const kw = q('#build_search').value.toString().trim();
    const teams=buildDB.teams.slice().sort((a,b)=> (a.rank||9999)-(b.rank||9999));
    const lowerKW = kw.toLowerCase();
    let shown=0;
    teams.forEach((t,i)=>{
      if(t.rank && t.rank>limit) return;
      if(kw){
        const hit = t.mons.some(m=> m.name && m.name.toLowerCase().includes(lowerKW));
        if(!hit) return;
      }
      const card=document.createElement('div'); card.className='team-card';
      const rows=t.mons.map((m,idx)=>`<tr><td>${idx+1}</td><td>${m.name||""}</td><td>${m.item||""}</td><td>${m.tera||""}</td></tr>`).join('');
      card.innerHTML = `<h4>順位: ${t.rank||'-'}</h4>
        <table class="team-table"><thead><tr><th>#</th><th>ポケモン</th><th>持ち物</th><th>テラス</th></tr></thead><tbody>${rows}</tbody></table>
        <div class="row" style="margin-top:6px">
          <button class="btn" data-apply-party>→ パーティに反映（ポケモンのみ）</button>
          <button class="btn" data-apply-opp>→ 相手6×6に反映（ポケモンのみ）</button>
        </div>`;
      card.querySelector('[data-apply-party]').addEventListener('click', ()=>{
        const party={name:`Rank${t.rank}`, members:t.mons.map(m=>({name:m.name||"", nature:"てれや", evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0}, moves:[]}))};
        fillPartyEditor(q('#party'), party);
        showTab('party');
      });
      card.querySelector('[data-apply-opp]').addEventListener('click', ()=>{
        const cards=Array.from(document.querySelectorAll('#opp .card'));
        t.mons.slice(0,6).forEach((m,i)=>{ const input=cards[i]?.querySelector('[data-poke-input]'); if(input){ input.value=m.name||""; input.dispatchEvent(new Event('change',{bubbles:true})); } });
        showTab('six');
      });
      wrap.appendChild(card);
      shown++;
    });
    const cnt=q('#build_count'); if(cnt) cnt.textContent = `表示 ${shown} 件 / 読込 ${buildDB.teams.length} 件`;
  }

  function readMonFromPanel(panel){
    const name=panel.querySelector('[data-poke-input]')?.value?.trim()||"";
    const nat=panel.querySelector('[data-nature]')?.value||'てれや';
    const ev={}; ['hp','atk','def','spa','spd','spe'].forEach(k=> ev[k]=Number(panel.querySelector('[data-ev-'+k+']')?.value||0));
    const stat=statBlock(name,ev,nat,50,31);
    const moves=Array.from(panel.querySelectorAll('[data-move-input]')).map(x=>x.value.trim()).filter(Boolean);
    return {name, stat, moves};
  }

  function pct(min,max,hp){ const a=Math.max(0,Math.min(100,Math.round(100*min/Math.max(1,hp)))); const b=Math.max(0,Math.min(100,Math.round(100*max/Math.max(1,hp)))); return [a,b]; }

  function calcSixMatrix(){
    const env={level:50, teraType:q('#sel_tera').value||null, weather:q('#sel_weather').value||null, critical:q('#chk_crit').checked, item:q('#sel_item').value||null, ability:q('#sel_ability').value||null, screen:q('#chk_screen').checked, format:'シングル'};
    const selfCards=Array.from(document.querySelectorAll('#self .card')), oppCards=Array.from(document.querySelectorAll('#opp .card'));
    const selfMons=selfCards.map(readMonFromPanel), oppMons=oppCards.map(readMonFromPanel);
    const mat=q('#matrix tbody'); mat.innerHTML=''; const thead=q('#matrix thead tr'); thead.innerHTML='<th>→</th>'+oppMons.map(m=>`<th>${m.name||'-'}</th>`).join('');

    selfMons.forEach(A=>{
      const tr=document.createElement('tr'); tr.appendChild(Object.assign(document.createElement('td'),{textContent:(A.name||'-')}));
      oppMons.forEach(B=>{
        const td=document.createElement('td');
        if(A.name && B.name && A.moves.length && !A.stat._unknown && !B.stat._unknown){
          const best=bestMoveDamage(A.stat,B.stat,env,A.moves);
          const [mi,ma]=pct(best.dmg[0],best.dmg[1],B.stat.hp); td.textContent=`${mi}-${ma}%`; td.title=best.name||'';
        }else if(A.name && B.name && (A.stat._unknown || B.stat._unknown)){
          td.textContent='—//?'; td.title='ポケモンデータ未登録';
        }else{ td.textContent='—//0'; }
        tr.appendChild(td);
      });
      mat.appendChild(tr);
    });
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    await loadData();
    build();
    document.querySelector('#btn_calc_all').addEventListener('click', calcSixMatrix);
  });
})();
