
(function(){
  const TYPES = ["ノーマル","ほのお","みず","でんき","くさ","こおり","かくとう","どく","じめん","ひこう","エスパー","むし","いわ","ゴースト","ドラゴン","あく","はがね","フェアリー"];
  const TYPE_CHART = {
    "ノーマル": {"いわ":0.5,"はがね":0.5,"ゴースト":0},
    "ほのお": {"くさ":2,"こおり":2,"むし":2,"はがね":2,"ほのお":0.5,"みず":0.5,"いわ":0.5,"ドラゴン":0.5},
    "みず": {"ほのお":2,"じめん":2,"いわ":2,"みず":0.5,"くさ":0.5,"ドラゴン":0.5},
    "でんき": {"みず":2,"ひこう":2,"でんき":0.5,"くさ":0.5,"ドラゴン":0.5,"じめん":0},
    "くさ": {"みず":2,"じめん":2,"いわ":2,"ほのお":0.5,"くさ":0.5,"どく":0.5,"ひこう":0.5,"むし":0.5,"ドラゴン":0.5,"はがね":0.5},
    "こおり": {"くさ":2,"じめん":2,"ひこう":2,"ドラゴン":2,"ほのお":0.5,"みず":0.5,"こおり":0.5,"はがね":0.5},
    "かくとう": {"ノーマル":2,"こおり":2,"いわ":2,"あく":2,"はがね":2,"どく":0.5,"ひこう":0.5,"エスパー":0.5,"むし":0.5,"フェアリー":0.5,"ゴースト":0},
    "どく": {"くさ":2,"フェアリー":2,"どく":0.5,"じめん":0.5,"いわ":0.5,"ゴースト":0.5,"はがね":0},
    "じめん": {"ほのお":2,"でんき":2,"どく":2,"いわ":2,"はがね":2,"くさ":0.5,"むし":0.5,"ひこう":0},
    "ひこう": {"くさ":2,"かくとう":2,"むし":2,"でんき":0.5,"いわ":0.5,"はがね":0.5},
    "エスパー": {"かくとう":2,"どく":2,"エスパー":0.5,"はがね":0.5,"あく":0},
    "むし": {"くさ":2,"エスパー":2,"あく":2,"ほのお":0.5,"かくとう":0.5,"どく":0.5,"ひこう":0.5,"ゴースト":0.5,"はがね":0.5,"フェアリー":0.5},
    "いわ": {"ほのお":2,"こおり":2,"ひこう":2,"むし":2,"かくとう":0.5,"じめん":0.5,"はがね":0.5},
    "ゴースト": {"エスパー":2,"ゴースト":2,"あく":0.5,"ノーマル":0},
    "ドラゴン": {"ドラゴン":2,"はがね":0.5,"フェアリー":0},
    "あく": {"エスパー":2,"ゴースト":2,"かくとう":0.5,"あく":0.5,"フェアリー":0.5},
    "はがね": {"こおり":2,"いわ":2,"フェアリー":2,"ほのお":0.5,"みず":0.5,"でんき":0.5,"はがね":0.5},
    "フェアリー": {"かくとう":2,"ドラゴン":2,"あく":2,"ほのお":0.5,"どく":0.5,"はがね":0.5}
  };
  const NATURES = {"いじっぱり":{atk:1.1,spa:0.9},"ようき":{spe:1.1,spa:0.9},"おくびょう":{spe:1.1,atk:0.9},"ひかえめ":{spa:1.1,atk:0.9},"ずぶとい":{def:1.1,atk:0.9},"おだやか":{spd:1.1,atk:0.9},"てれや":{}};
  const moveDB = {list: []};
  const pokeDB = {map: new Map()};
  const NAME_ALIAS = {'Ho-Oh':'ホウオウ','ho-oh':'ホウオウ','HOUOU':'ホウオウ'};
  function normName(s){ return (s||'').toString().trim().replace(/[\\s・・]/g,'').toLowerCase(); }

  async function loadData(){
    try{ moveDB.list = await fetch("./data/moves.min.json",{cache:"no-store"}).then(r=>r.json()); }catch(e){ moveDB.list=[]; }
    try{
      const pk = await fetch("./data/pokemon_master.json",{cache:"no-store"}).then(r=>r.json());
      const arr = Array.isArray(pk)? pk : (pk.pokemon||[]);
      arr.forEach(p=>{
        const name = (p.name||p.jp||p.ja||p.en||p.eng||"").trim();
        const types = p.types||p.type||[];
        const base = p.base||p.stats||{};
        if(name) pokeDB.map.set(name, {types, base});
      });
      // alias & normalized keys
      const keys=[...pokeDB.map.keys()];
      keys.forEach(n=>{ const nn=normName(n); if(!pokeDB.map.has(nn)) pokeDB.map.set(nn, pokeDB.map.get(n)); });
      Object.keys(NAME_ALIAS).forEach(k=>{ const v=NAME_ALIAS[k]; const tgt=pokeDB.map.get(v)||pokeDB.map.get(normName(v)); if(tgt){ pokeDB.map.set(k, tgt); pokeDB.map.set(normName(k), tgt);} });
    }catch(e){}
  }

  function toStat(base, iv, ev, level, natureMul, isHP=false){
    base = Number(base||0); iv=Number(iv||31); ev=Number(ev||0); level=Number(level||50); natureMul = Number(natureMul||1);
    if(isHP){ return Math.floor(((2*base + iv + Math.floor(ev/4)) * level)/100) + level + 10; }
    const s = Math.floor(((2*base + iv + Math.floor(ev/4)) * level)/100) + 5;
    return Math.floor(s * natureMul);
  }
  function natureMul(stat, nature){ const n=NATURES[nature]||{}; if(n[stat]>1) return 1.1; if(n[stat]&&n[stat]<1) return 0.9; return 1.0; }
  function typeEffect(moveType, defTypes){ let m=1.0; (defTypes||[]).forEach(t=>{ const row=TYPE_CHART[moveType]||{}; m*= (row[t]||1.0); }); return m; }
  function stabMultiplier(attTypes, teraType, moveType){ const has=attTypes.includes(moveType); if(teraType && teraType===moveType){ return attTypes.includes(teraType)?2.0:1.5; } return has?1.5:1.0; }
  function weatherMul(weather, moveType){ if(weather==="雨"){ if(moveType==="みず")return 1.5; if(moveType==="ほのお")return 0.5;} if(weather==="晴れ"){ if(moveType==="ほのお")return 1.5; if(moveType==="みず")return 0.5;} return 1.0; }
  function screenMul(screen, category, format){ if(!screen) return 1.0; const dbl=(format==="ダブル"); return dbl? (2/3):0.5; }
  function itemMul(item, category){ if(!item) return 1.0; if(/こだわりハチマキ/.test(item)&&category==="物理") return 1.5; if(/こだわりメガネ/.test(item)&&category==="特殊") return 1.5; if(/いのちのたま/.test(item)) return 1.3; return 1.0; }
  function abilityMul(ability, moveType, category){ if(!ability) return 1.0; if(/てきおうりょく/.test(ability)) return 1.33; if(/もらいび/.test(ability)&&moveType==="ほのお") return 1.5; return 1.0; }

  function calcDamage(ctx){
    const L=Number(ctx.level||50); const A=ctx.category==="物理"?ctx.atk:ctx.spa; const D=ctx.category==="物理"?ctx.def:ctx.spd;
    const BP=Math.max(1,Number(ctx.power||0)); const base=Math.floor(Math.floor((2*L/5+2)*BP*A/Math.max(1,D))/50)+2;
    let mod=1.0; mod*=stabMultiplier(ctx.attackerTypes||[],ctx.teraType,ctx.moveType); mod*=typeEffect(ctx.moveType,ctx.defenderTypes||[]); mod*=weatherMul(ctx.weather,ctx.moveType);
    if(ctx.critical) mod*=1.5; if(ctx.burn&&ctx.category==="物理") mod*=0.5; mod*=itemMul(ctx.item,ctx.category); mod*=abilityMul(ctx.ability,ctx.moveType,ctx.category); if(ctx.screen) mod*=screenMul(true,ctx.category,ctx.format||"シングル");
    const min=Math.floor(base*mod*0.85); const max=Math.floor(base*mod*1.00); return [min,max];
  }

  function buildDatalist(id, options){ const dl=document.createElement("datalist"); dl.id=id; options.forEach(v=>{ const o=document.createElement("option"); o.value=v; dl.appendChild(o); }); document.body.appendChild(dl); }
  function moveByName(n){ n=(n||'').trim(); return moveDB.list.find(m=>(m.n||m.name)===n); }
  function pokeInfo(n){ const key=(n||'').trim(); return pokeDB.map.get(key)||pokeDB.map.get(normName(key))||pokeDB.map.get(NAME_ALIAS[key])||pokeDB.map.get(normName(NAME_ALIAS[key]||'')); }

  function statBlock(name, evs, nature, level=50, iv=31){
    const info=pokeInfo(name); const unknown=!info || !info.base || Object.keys(info.base).length===0; const safe=info||{types:[],base:{}};
    const defB = unknown? {hp:0,atk:0,def:0,spa:0,spd:0,spe:0} : Object.assign({hp:1,atk:1,def:1,spa:1,spd:1,spe:1}, safe.base||{});
    return {
      hp: toStat(defB.hp, iv, evs.hp||0, level, 1.0, true),
      atk: toStat(defB.atk, iv, evs.atk||0, level, natureMul("atk", nature)),
      def: toStat(defB.def, iv, evs.def||0, level, natureMul("def", nature)),
      spa: toStat(defB.spa, iv, evs.spa||0, level, natureMul("spa", nature)),
      spd: toStat(defB.spd, iv, evs.spd||0, level, natureMul("spd", nature)),
      spe: toStat(defB.spe, iv, evs.spe||0, level, natureMul("spe", nature)),
      types: (safe.types||[]), _unknown: unknown
    };
  }

  function presetEV(name){ const m={"H252B252":{hp:252,def:252,spd:4},"H252D252":{hp:252,spd:252,def:4},"A252S252":{atk:252,spe:252,hp:4},"C252S252":{spa:252,spe:252,hp:4}}; return m[name]||{hp:0,atk:0,def:0,spa:0,spd:0,spe:0}; }
  function hPct(dmg,hp){ const min=Math.max(0,Math.min(100,Math.round(100*dmg[0]/max(1,hp)))) , max=Math.max(0,Math.min(100,Math.round(100*dmg[1]/max(1,hp)))); return [min,max]; }
  function max(a,b){return a>b?a:b}

  function bestMoveDamage(attacker, defender, env, moves){
    let best=[0,0], name="";
    for(const mvName of moves){ const mv=moveByName(mvName); if(!mv) continue; if(mv.c==="変化"||!mv.p) continue;
      const ctx={level:env.level||50, atk:attacker.atk, spa:attacker.spa, def:defender.def, spd:defender.spd, power:mv.p, category:mv.c, moveType:mv.t,
        attackerTypes:attacker.types, defenderTypes:defender.types, teraType:env.teraType||null, weather:env.weather||null, critical:env.critical||false, burn:false,
        item:env.item||null, ability:env.ability||null, screen:env.screen||false, format:env.format||"シングル"};
      const dmg=calcDamage(ctx); if(dmg[1]>best[1]){ best=dmg; name=mvName; }
    }
    return {dmg:best, name};
  }

  function q(s,r){return (r||document).querySelector(s)}; function qa(s,r){return Array.from((r||document).querySelectorAll(s))}
  function showTab(id){ qa(".tab").forEach(t=>t.setAttribute("aria-selected",t.dataset.tab===id?"true":"false")); qa(".panel").forEach(p=>p.setAttribute("aria-hidden", p.id===id?"false":"true")); }

  function build(){
    qa(".tab").forEach(t=> t.addEventListener("click", ()=> showTab(t.dataset.tab))); showTab("six");
    buildDatalist("dl_moves", (moveDB.list.map(m=>m.n||m.name).filter(Boolean).sort())) ;
    buildDatalist("dl_pokemon", Array.from(pokeDB.map.keys()).filter(k=>!/^[a-z0-9]/i.test(k)).sort()); // 日本語名優先
    qa('[data-move-input]').forEach(inp=>{ inp.setAttribute("list","dl_moves"); inp.addEventListener("change", ()=>{ const row=inp.closest(".row"); const mv=moveByName(inp.value); if(mv&&row){ const t=q('[data-move-type]',row), c=q('[data-move-cat]',row), p=q('[data-move-pow]',row); if(t&&!t.value) t.value=mv.t||""; if(c&&!c.value) c.value=mv.c||""; if(p&&(!p.value||p.value==="0")) p.value=mv.p||0; } }); });
    qa('[data-poke-input]').forEach(inp=> inp.setAttribute("list","dl_pokemon"));
    qa('[data-ev-preset]').forEach(btn=> btn.addEventListener("click", ()=>{ const row=btn.closest(".row"); const ev=presetEV(btn.dataset.evPreset); ['hp','atk','def','spa','spd','spe'].forEach(k=>{ const el=q('[data-ev-'+k+']',row); if(el) el.value=ev[k]||0; }); }));
    q('#btn_calc_all').addEventListener('click', calcSixMatrix);
  }

  function readMonFromPanel(panel){
    const name=q('[data-poke-input]',panel).value.trim(); const nature=q('[data-nature]',panel).value||"てれや";
    const ev={}; ['hp','atk','def','spa','spd','spe'].forEach(k=> ev[k]=Number(q('[data-ev-'+k+']',panel).value||0));
    const stat=statBlock(name, ev, nature, 50, 31); const moves=qa('[data-move-input]',panel).map(x=>x.value.trim()).filter(Boolean);
    return {name, stat, moves};
  }

  function calcSixMatrix(){
    const env={level:50, teraType:q('#sel_tera').value||null, weather:q('#sel_weather').value||null, critical:q('#chk_crit').checked, item:q('#sel_item').value||null, ability:q('#sel_ability').value||null, screen:q('#chk_screen').checked, format:'シングル'};
    const selfPanels=qa('#self .card'), oppPanels=qa('#opp .card'); const mat=q('#matrix tbody'); mat.innerHTML='';
    const selfMons=selfPanels.map(p=>readMonFromPanel(p)), oppMons=oppPanels.map(p=>readMonFromPanel(p));
    const thead=q('#matrix thead tr'); thead.innerHTML='<th>→</th>'+oppMons.map(m=>`<th>${m.name||'-'}</th>`).join('');
    selfMons.forEach(A=>{ const tr=document.createElement('tr'); tr.appendChild(Object.assign(document.createElement('td'),{textContent:(A.name||'-')}));
      oppMons.forEach(B=>{ const td=document.createElement('td');
        if(A.name && B.name && A.moves.length && !A.stat._unknown && !B.stat._unknown){ const best=bestMoveDamage(A.stat,B.stat,env,A.moves); const hp=Math.max(1,B.stat.hp); const min=Math.max(0,Math.min(100,Math.round(100*best.dmg[0]/hp))); const max=Math.max(0,Math.min(100,Math.round(100*best.dmg[1]/hp))); td.textContent=`${min}-${max}%`; td.title=best.name||''; }
        else if(A.name && B.name && (A.stat._unknown || B.stat._unknown)){ td.textContent='—//?'; td.title='ポケモンデータ未登録'; }
        else { td.textContent='—//0'; }
        tr.appendChild(td);
      }); mat.appendChild(tr);
    });
  }

  document.addEventListener('DOMContentLoaded', async ()=>{ await loadData(); build(); });
})();
