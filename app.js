
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

  const IMMUNE_PAIRS=new Set([
    ["ノーマル","ゴースト"],["かくとう","ゴースト"],["どく","はがね"],["じめん","ひこう"],["でんき","じめん"],["エスパー","あく"],["ドラゴン","フェアリー"]
  ].map(x=>x.join("@")));

  const moveDB={list:[]};
  const TYPE_ALIAS = new Map(Object.entries({
    "電気":"でんき","炎":"ほのお","水":"みず","草":"くさ","氷":"こおり","地面":"じめん","飛行":"ひこう",
    "悪":"あく","鋼":"はがね","妖精":"フェアリー","格闘":"かくとう","超":"エスパー","虫":"むし","岩":"いわ",
    "霊":"ゴースト","龍":"ドラゴン","普通":"ノーマル","ノーマル":"ノーマル","ほのお":"ほのお","みず":"みず","でんき":"でんき",
    "くさ":"くさ","こおり":"こおり","かくとう":"かくとう","どく":"どく","じめん":"じめん","ひこう":"ひこう","エスパー":"エスパー",
    "むし":"むし","いわ":"いわ","ゴースト":"ゴースト","ドラゴン":"ドラゴン","あく":"あく","はがね":"はがね","フェアリー":"フェアリー",
    "ノーマル":"ノーマル",
    "ホノオ":"ほのお",
    "ミズ":"みず",
    "デンキ":"でんき",
    "クサ":"くさ",
    "コオリ":"こおり",
    "カクトウ":"かくとう",
    "ドク":"どく",
    "ジメン":"じめん",
    "ヒコウ":"ひこう",
    "エスパー":"エスパー",
    "ムシ":"むし",
    "イワ":"いわ",
    "ゴースト":"ゴースト",
    "ドラゴン":"ドラゴン",
    "アク":"あく",
    "ハガネ":"はがね",
    "フェアリー":"フェアリー",
    "ほのお":"ほのお",
    "みず":"みず",
    "でんき":"でんき",
    "くさ":"くさ",
    "こおり":"こおり",
    "かくとう":"かくとう",
    "どく":"どく",
    "じめん":"じめん",
    "ひこう":"ひこう",
    "いわ":"いわ",
    "むし":"むし",
    "あく":"あく",
    "はがね":"はがね"
  }));
  function canonType(s){
    if(!s) return "";
    let t = (""+s).trim().replace(/\\s+/g,"");
    if(TYPE_ALIAS.has(t)) return TYPE_ALIAS.get(t);
    return t;
  }
  function normTypeList(arr){ return (arr||[]).map(canonType).filter(Boolean); }

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
        const types = normTypeList(t2? [t1,t2] : [t1]);
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
    // Early immunity (already present elsewhere)
    const mtype = canonType(ctx.moveType);
    const dtypes = normTypeList(ctx.defenderTypes||[]);
    for(const dt of dtypes){
      if(IMMUNE_PAIRS && IMMUNE_PAIRS.has([mtype, dt].join("@"))) return [0,0,0];
    }
    // Rank helper
    function stageMult(stage){
      stage = Math.max(-6, Math.min(6, Number(stage||0)));
      if(stage>=0) return (2+stage)/2;
      return 2/(2-stage);
    }
    // Early immunity check (redundant safety)
    mtype = canonType(ctx.moveType);
    dtypes = normTypeList(ctx.defenderTypes||[]);
    for(const dt of dtypes){
      if(IMMUNE_PAIRS.has([mtype, dt].join("@"))) return [0,0,0];
    }
    const L=Number(ctx.level||50), A=ctx.category==="物理"?ctx.atk:ctx.spa, D=ctx.category==="物理"?ctx.def:ctx.spd;
    const BP=Math.max(1,Number(ctx.power||0));
    const typeMul=typeEffect(canonType(ctx.moveType), normTypeList(ctx.defenderTypes||[]));
    if(typeMul===0) return [0,0,0];
    const base=Math.floor(Math.floor((2*L/5+2)*BP*A/Math.max(1,D))/50)+2;
    let mod=1.0; const stab=stabMultiplier(normTypeList(ctx.attackerTypes||[]),ctx.teraType,canonType(ctx.moveType));
    mod*=stab; mod*=typeMul; mod*=weatherMul(ctx.weather,canonType(ctx.moveType));
    if(ctx.critical) mod*=1.5; if(ctx.burn&&ctx.category==="物理") mod*=0.5; mod*=itemMul(ctx.item,ctx.category); mod*=abilityMul(ctx.ability,canonType(ctx.moveType),ctx.category); if(ctx.screen) mod*= 0.5;
    const min=Math.floor(base*mod*0.85), max=Math.floor(base*mod*1.00);
    return [min,max,typeMul];
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

  function applyTypeChips(panel, types){
    if(!panel) return;
    const box = panel.querySelector('[data-typechips]');
    if(!box) return;
    box.innerHTML = "";
    (types||[]).forEach(t=>{
      const span=document.createElement('span');
      span.className='chip'; span.textContent=t;
      box.appendChild(span);
    });
  }

  function bestMoveDamage(att,def,env,moves){
    let best=[0,0], bestMul=1, name="";
    for(const mvName of moves){
      const mv=moveByName(mvName); if(!mv) continue; if(mv.c==="変化"||!mv.p) continue;
      mtype = canonType(mv.t);
      if(!mtype || !(TYPE_CHART[mtype])) continue; // タイプ未設定や未知のタイプはスキップ
      const ctx={level:50, atk:att.atk, spa:att.spa, def:def.def, spd:def.spd, power:mv.p, category:mv.c, moveType:mtype, attackerTypes:normTypeList(att.types), defenderTypes:normTypeList(def.types),
        teraType:document.getElementById('sel_tera').value||null, weather:document.getElementById('sel_weather').value||null, critical:document.getElementById('chk_crit').checked, burn:false, item:document.getElementById('sel_item').value||null, ability:document.getElementById('sel_ability').value||null, screen:document.getElementById('chk_screen').checked, format:'シングル'};
      const dmg=calcDamage(ctx);
      const mul = (Array.isArray(dmg)&&dmg.length>2)? dmg[2] : 1;
      if(dmg[1]>best[1]){ best=[dmg[0],dmg[1]]; bestMul=mul; name=mvName; }
    }
    return {dmg:best, name, mul:bestMul};
  }

  function TYPES_HTML(){return TYPES.map(t=>`<option>${t}</option>`).join("")}
  function fillTypeSelect(sel){ sel.innerHTML='<option value="">タイプ</option>'+TYPES_HTML(); }
  function moveRowHTML(i){return `<div class="row"><label>技${i}</label><input type="text" data-move-input placeholder="技名" list="dl_moves"/><select data-move-type><option value="">タイプ</option>${TYPES_HTML()}</select><select data-move-cat><option value="">分類</option><option>物理</option><option>特殊</option><option>変化</option></select><input type="number" data-move-pow placeholder="威力"/></div>`}
  function cardTemplate(side,idx){
    return `<div class="card panel" style="display:block" data-side="${side}" data-slot="${idx}">
      <div class="row"><label>名前</label><input type="text" data-poke-input placeholder="ポケモン" list="dl_pokemon"/><div class="chips" data-typechips></div></div>
      <div class="row"><label>性格</label><select data-nature><option>てれや</option><option>いじっぱり</option><option>ようき</option><option>ひかえめ</option><option>おくびょう</option><option>ずぶとい</option><option>おだやか</option></select></div>
      <div class="row"><span class="pill">EV</span><input type="number" data-ev-hp placeholder="H" value="0"/><input type="number" data-ev-atk placeholder="A" value="0"/><input type="number" data-ev-def placeholder="B" value="0"/><input type="number" data-ev-spa placeholder="C" value="0"/><input type="number" data-ev-spd placeholder="D" value="0"/><input type="number" data-ev-spe placeholder="S" value="0"/>
      <button class="btn" data-ev-preset="A252S252">A252S252</button><button class="btn" data-ev-preset="C252S252">C252S252</button><button class="btn" data-ev-preset="H252B252">H252B252</button><button class="btn" data-ev-preset="H252D252">H252D252</button></div>
      ${side==="self"||side==="party"? (moveRowHTML(1)+moveRowHTML(2)+moveRowHTML(3)+moveRowHTML(4)) : ""}
    </div>`;
  }

  function buildSix(){
    const selfWrap=document.querySelector('#self .cards'), oppWrap=document.querySelector('#opp .cards');
    for(let i=1;i<=6;i++){ selfWrap.insertAdjacentHTML('beforeend', cardTemplate('self', i)); }
    for(let i=1;i<=6;i++){ oppWrap.insertAdjacentHTML('beforeend', cardTemplate('opp', i)); }
  }
  function buildParty(){
    const pw=document.querySelector('#party .cards');
    for(let i=1;i<=6;i++){ pw.insertAdjacentHTML('beforeend', cardTemplate('party', i)); }
  }
  function wireCommonInputs(root){
    root.querySelectorAll('[data-move-input]').forEach(inp=>{
      inp.addEventListener('change',()=>{
        const row=inp.closest('.row'), mv=moveByName(inp.value);
        if(mv&&row){ const t=row.querySelector('[data-move-type]'), c=row.querySelector('[data-move-cat]'), p=row.querySelector('[data-move-pow]');
          if(t&&!t.value) t.value=canonType(mv.t)||''; if(c&&!c.value) c.value=mv.c||''; if(p&&(!p.value||p.value==='0')) p.value=mv.p||0;
        }
      });
    });
    root.querySelectorAll('[data-poke-input]').forEach(inp=>{
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

  function parseBuild(json){
    let arr=[];
    if(Array.isArray(json)) arr=json;
    else if(json.teams) arr=json.teams;
    else if(json.data) arr=json.data;
    else if(json.list) arr=json.list;
    if(arr.length===0){
      for(const k of Object.keys(json||{})){
        const v=json[k];
        if(Array.isArray(v)){ arr=v; break; }
      }
    }
    const digTeam = (rec)=>{
      if(!rec) return null;
      const rawTeam = rec.team || rec.members || rec.pokemon || rec.party || rec.list || rec["チーム"] || rec["構築"] || rec["パーティ"] || rec["ポケモン"];
      if(Array.isArray(rawTeam)) return rawTeam;
      if(Array.isArray(rec)) return rec;
      if(rec.member && Array.isArray(rec.member)) return rec.member;
      const cand = ["p1","p2","p3","p4","p5","p6"].map(k=>rec[k]).filter(Boolean);
      if(cand.length) return cand;
      return null;
    };
    const toMon = (m)=>{
      const name=(m&& (m.name||m.pokemon||m["ポケモン"]||m.name_ja||m["name_ja"]||m.species||"")).toString().trim();
      const item=(m&& (m.item||m.held_item||m["持ち物"]||"")).toString().trim();
      const tera=(m&& (m.tera||m.terastal||m.tera_type||m["テラス"]||"")).toString().trim();
      return {name,item,tera};
    };
    const toRank = (rec,idx)=> Number(rec.rank||rec.Rank||rec["順位"]||rec.place||rec["place"]|| idx+1);
    const teams=[];
    (arr||[]).forEach((rec,idx)=>{
      let list = digTeam(rec);
      if(Array.isArray(list)&&list.length){
        teams.push({rank:toRank(rec,idx), mons:list.slice(0,6).map(toMon)});
      }
    });
    return teams;
  }

  function buildUI(){
    document.querySelectorAll('.tab').forEach(t=> t.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(u=>u.setAttribute('aria-selected', u===t?'true':'false'));
      document.querySelectorAll('.panel').forEach(p=>p.setAttribute('aria-hidden', p.id===t.dataset.tab?'false':'true'));
    }));
    document.querySelector('.tab[data-tab="build"]').click();

    buildDatalist('dl_moves', (moveDB.list.map(m=>m.n||m.name).filter(Boolean).sort()));
    buildDatalist('dl_pokemon', pokeDB.displayNames);

    buildSix(); buildParty(); wireCommonInputs(document);

    // 構築記事ファイル読込
    document.getElementById('btn_build_import').addEventListener('click', ()=> document.getElementById('build_import_file').click());
    document.getElementById('build_import_file').addEventListener('change', ev=>{
      const file=ev.target.files[0]; if(!file) return;
      const rd=new FileReader(); rd.onload=()=>{
        try{
          const json=JSON.parse(rd.result);
          buildDB.raw=json;
          buildDB.teams=parseBuild(json);
          if(!buildDB.teams.length){ alert('構築チームが見つかりませんでした（ファイル形式を確認してください）'); return; }
          renderBuildCards();
          document.querySelector('.tab[data-tab="build"]').click();
        }catch(e){ alert('構築記事JSONの読み取りに失敗しました'); console.error(e); }
      }; rd.readAsText(file,'utf-8');
    });
    document.getElementById('build_rank_max').addEventListener('input', renderBuildCards);
    document.getElementById('build_search').addEventListener('input', renderBuildCards);

    // 6×6 相手JSON読み込み（複数チームピッカー）
    const fi=document.getElementById('team_file'), bt=document.getElementById('btn_team_import');
    bt.addEventListener('click', ()=> fi.click());
    fi.addEventListener('change', ev=>{
      const file=ev.target.files[0]; if(!file) return;
      const rd=new FileReader(); rd.onload=()=>{
        try{
          const json=JSON.parse(rd.result);
          const teams=parseBuild(json);
          if(!teams.length){ alert('有効なチームが見つかりませんでした'); return; }
          const picker=document.getElementById('opp_picker');
          if(picker){ picker.remove(); }
          const bar=document.getElementById('matrix_bar');
          const box=document.createElement('div'); box.id='opp_picker'; box.style.display='flex'; box.style.gap='8px'; box.style.alignItems='center';
          box.innerHTML='<label>相手構築</label><select id="opp_picker_select"></select><button class="btn" id="opp_picker_apply">反映</button>';
          bar.appendChild(box);
          const sel=box.querySelector('#opp_picker_select');
          teams.forEach((t,idx)=>{
            const o=document.createElement('option'); o.value=idx; o.textContent=`順位${t.rank||'-'}: ${t.mons.map(m=>m.name).filter(Boolean).slice(0,3).join(' / ')}…`; sel.appendChild(o);
          });
          box.querySelector('#opp_picker_apply').onclick=()=>{
            const i=Number(sel.value||0);
            const cards=Array.from(document.querySelectorAll('#opp .card'));
            (teams[i].mons||[]).slice(0,6).forEach((m,idx)=>{
              const input=cards[idx]?.querySelector('[data-poke-input]');
              if(input){ input.value=m.name||""; input.dispatchEvent(new Event('change',{bubbles:true})); }
            });
            box.remove();
            document.querySelector('.tab[data-tab="six"]').click();
          };
        }catch(e){ alert('JSONの形式を読み取れませんでした'); console.error(e); }
      }; rd.readAsText(file,'utf-8');
    });

    // 一括計算
    document.getElementById('btn_calc_all_top').addEventListener('click', calcSixMatrix);
    document.getElementById('btn_calc_all').addEventListener('click', calcSixMatrix);

    // パーティ → 6×6（自分）に反映
    document.getElementById('btn_party_apply_self').addEventListener('click', ()=>{
      const party = collectParty(document.getElementById('party'));
      applyPartyToSelf(party);
    });

    // === Single calc wiring ===
    (function(){
      const msel = document.getElementById('sc_move');
      const mtyp = document.getElementById('sc_move_t');
      const mcat = document.getElementById('sc_move_c');
      const mpow = document.getElementById('sc_move_p');
      const aName = document.getElementById('sc_a_name');
      const bName = document.getElementById('sc_b_name');
      const aTypes = document.getElementById('sc_a_types');
      const bTypes = document.getElementById('sc_b_types');
      const teraSel = document.getElementById('sc_a_tera');
      if(msel && mtyp && teraSel){ fillTypeSelect(mtyp); fillTypeSelect(teraSel); }

      if(msel){
        msel.addEventListener('change', ()=>{
          const mv = moveByName(msel.value);
          if(mv){ if(!mtyp.value) mtyp.value=canonType(mv.t)||''; if(!mcat.value) mcat.value=mv.c||''; if(!mpow.value||mpow.value==='0') mpow.value=mv.p||0; }
        });
      }
      if(aName){
        aName.addEventListener('change', ()=>{ const info=pokeInfo(aName.value||''); aTypes.innerHTML=''; (info?.types||[]).forEach(t=>{ const s=document.createElement('span'); s.className='chip'; s.textContent=t; aTypes.appendChild(s); }); });
      }
      if(bName){
        bName.addEventListener('change', ()=>{ const info=pokeInfo(bName.value||''); bTypes.innerHTML=''; (info?.types||[]).forEach(t=>{ const s=document.createElement('span'); s.className='chip'; s.textContent=t; bTypes.appendChild(s); }); });
      }

      function readEV(prefix){
        const get=(id)=> Number(document.getElementById(prefix+id).value||0);
        return {hp:get('_ev_hp'), atk:get('_ev_atk'), def:get('_ev_def'), spa:get('_ev_spa'), spd:get('_ev_spd'), spe:get('_ev_spe')};
      }
      function readNature(prefix){ const el=document.getElementById(prefix+'_nature'); return el? el.value : 'てれや'; }
      function applyEVPreset(prefix,code){
        
        const map={
          'HA252':{hp:252,atk:252}, 'AS252':{atk:252,spe:252},
          'HB252':{hp:252,def:252}, 'HD252':{hp:252,spd:252},
          'CS252':{spa:252,spe:252}, 'BD252':{def:252,spd:252},
          'HC252':{hp:252,spa:252}
        };
        const evs=map[code]||{};
        const ids={'hp':'_ev_hp','atk':'_ev_atk','def':'_ev_def','spa':'_ev_spa','spd':'_ev_spd','spe':'_ev_spe'};
        // reset all to 0 first
        for(const k in ids){ const el=document.getElementById(prefix+ids[k]); if(el) el.value=0; }
        // apply
        for(const k in evs){ const el=document.getElementById(prefix+ids[k]); if(el) el.value=evs[k]; }
        // assign 4 to HP if total<508
        let total=0; for(const k in ids){ const el=document.getElementById(prefix+ids[k]); total+= Number(el&&el.value||0); }
        if(total<=504){ const hpEl=document.getElementById(prefix+ids['hp']); if(hpEl) hpEl.value = Number(hpEl.value||0)+4; }
      
      }

      const btn=document.getElementById('sc_calc');
      const ap=document.getElementById('sc_a_ev_presets'); const bp=document.getElementById('sc_b_ev_presets');
      function bindPresetBar(bar,prefix){ if(!bar) return; bar.querySelectorAll('[data-evp]').forEach(b=> b.addEventListener('click', ()=> applyEVPreset(prefix,b.dataset.evp))); }
      bindPresetBar(ap,'sc_a'); bindPresetBar(bp,'sc_b');
      if(btn){
        btn.addEventListener('click', ()=>{
          const aN=(aName&&aName.value||'').trim(), bN=(bName&&bName.value||'').trim();
          const mv= msel? moveByName(msel.value) : null;
          mtype = canonType((mtyp&&mtyp.value) || (mv&&mv.t) || '');
          const mcatv = (mcat&&mcat.value) || (mv&&mv.c) || '変化';
          const mp = Number((mpow&&mpow.value) || (mv&&mv.p) || 0);

          const A = statBlock(aN, readEV('sc_a'), readNature('sc_a'), 50, 31);
          const B = statBlock(bN, readEV('sc_b'), readNature('sc_b'), 50, 31);

          const ctx = {level:50, atk:A.atk, spa:A.spa, def:B.def, spd:B.spd, power:mp, category:mcatv, moveType:mtype, attackerTypes:A.types, defenderTypes:B.types,
            teraType:(document.getElementById('sc_a_tera')||{}).value||null, weather:(document.getElementById('sc_weather')||{}).value||null,
            critical: !!(document.getElementById('sc_a_crit')||{}).checked, burn: !!(document.getElementById('sc_a_burn')||{}).checked,
            item:(document.getElementById('sc_a_item')||{}).value||null, ability:(document.getElementById('sc_a_ability')||{}).value||null,
            screenPhys: !!(document.getElementById('sc_b_reflect')||{}).checked, screenSpec: !!(document.getElementById('sc_b_lightscreen')||{}).checked,
            atkRank: (document.getElementById('sc_a_rank_atk')||{}).value, defRank: (document.getElementById('sc_b_rank_def')||{}).value
          };

          const dmg = calcDamage(ctx);
          const hp = B.hp||1;
          let pctMin = Math.max(0, Math.round(100*dmg[0]/Math.max(1,hp)));
          let pctMax = Math.max(0, Math.round(100*dmg[1]/Math.max(1,hp)));
          if(dmg[2]===0){ pctMin=0; pctMax=0; }
          const out = document.getElementById('sc_result'); if(out) out.style.display='block';
          const pctEl=document.getElementById('sc_pct'); if(pctEl) pctEl.textContent = `${pctMin}-${pctMax}% (${dmg[0]}-${dmg[1]})`;
          const detEl=document.getElementById('sc_detail'); if(detEl) detEl.textContent = `技:${(msel&&msel.value)||''} / タイプ:${mtype||'-'} / 相性:${dmg[2]} / 攻:${(A.types||[]).join('/')} / 防:${(B.types||[]).join('/')}`;
        });
      }
    })();

    // === Timer wiring ===
    ;(function(){
      const face=document.getElementById('tmr_face');
      if(!face) return;
      const btnStart=document.getElementById('tmr_start');
      const btnPause=document.getElementById('tmr_pause');
      const btnReset=document.getElementById('tmr_reset');
                        const beep=document.getElementById('tmr_beep');
      let target=20*60*1000; // default 20m
      let remain=target;
      let running=false, last=0, rafId=0;

      function fmt(ms){
        const s=Math.max(0,Math.floor(ms/1000)), m=Math.floor(s/60), ss=s%60, ds=Math.floor((ms%1000)/100);
        return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}.${ds}`;
      }
      function draw(){ face.textContent=fmt(remain); face.classList.toggle('warn', remain<=10000); }
      function tick(t){
        if(!running){ return; }
        const dt = t - last; last = t; remain -= dt; if(remain<=0){ remain=0; running=false; try{beep.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAA=='; beep.play().catch(()=>{});}catch(e){} }
        draw(); if(running) { rafId=requestAnimationFrame(tick); }
      }
      function start(){ if(running) return; running=true; last=performance.now(); rafId=requestAnimationFrame(tick); }
      function pause(){ running=false; if(rafId) cancelAnimationFrame(rafId); }
      function reset(){ pause(); remain=target; draw(); }
      function addLog(s){}

      btnStart&& (btnStart.onclick=()=>{ start(); addLog('▶ 開始'); });
      btnPause&& (btnPause.onclick=()=>{ pause(); addLog('⏸ 一時停止'); });
      btnReset&& (btnReset.onclick=()=>{ reset(); addLog('⟲ リセット'); });
      
      

      const setBtn=document.getElementById('tmr_set');
      const inMin=document.getElementById('tmr_min');
      const inSec=document.getElementById('tmr_sec');
      if(setBtn){ setBtn.onclick=()=>{ const m=Math.max(0,Number(inMin?.value||0)); const s=Math.max(0,Math.min(59,Number(inSec?.value||0))); target=(m*60+s)*1000; remain=target; draw(); addLog(`Manual: ${m}m${s}s に設定`); }; }

      document.querySelectorAll('[data-preset]').forEach(b=> b.addEventListener('click', ()=>{
        const sec = Number(b.dataset.preset||0); target = sec*1000; remain=target; draw(); addLog(`Preset: ${sec}s に設定`);
      }));

      draw();
    })();

}

function collectParty(root){
    const cards=Array.from(root.querySelectorAll('.card')); const members=[];
    cards.slice(0,6).forEach(c=>{
      const name=c.querySelector('[data-poke-input]')?.value?.trim()||"";
      const nature=c.querySelector('[data-nature]')?.value||"てれや";
      const evs={}; ['hp','atk','def','spa','spd','spe'].forEach(k=> evs[k]=Number(c.querySelector('[data-ev-'+k+']')?.value||0));
      const moves=Array.from(c.querySelectorAll('[data-move-input]')).map(i=>i.value.trim()).filter(Boolean);
      members.push({name,nature,evs,moves});
    });
    return {name:document.getElementById('party_name').value||"", members};
  }
  function applyPartyToSelf(party){
    const cards=Array.from(document.querySelectorAll('#self .card'));
    (party.members||[]).slice(0,6).forEach((m,i)=>{
      const c=cards[i]; if(!c) return;
      const name=c.querySelector('[data-poke-input]'); if(name){ name.value=m.name||""; name.dispatchEvent(new Event('change',{bubbles:true})); }
      ['hp','atk','def','spa','spd','spe'].forEach(k=>{ const el=c.querySelector('[data-ev-'+k+']'); if(el) el.value=(m.evs&&m.evs[k])||0; });
      const mvInputs=Array.from(c.querySelectorAll('[data-move-input]'));
      mvInputs.forEach((inp,idx)=>{
        const mv=(m.moves||[])[idx]; const row=inp.closest('.row');
        if(mv){ inp.value=mv; if(row){ const mvObj=moveByName(mv); if(mvObj){ const t=row.querySelector('[data-move-type]'), cat=row.querySelector('[data-move-cat]'), p=row.querySelector('[data-move-pow]'); if(t) t.value=canonType(mvObj.t)||""; if(cat) cat.value=mvObj.c||""; if(p) p.value=mvObj.p||0; } } }
        else { inp.value=""; if(row){ const t=row.querySelector('[data-move-type]'), cat=row.querySelector('[data-move-cat]'), p=row.querySelector('[data-move-pow]'); if(t) t.value=""; if(cat) cat.value=""; if(p) p.value=""; } }
      });
    });
    document.querySelector('.tab[data-tab="six"]').click();
  }

  function readMonFromPanel(panel){
    const nm=(panel.querySelector('[data-poke-input]')?.value||"").trim();
    const nat=panel.querySelector('[data-nature]')?.value||'てれや';
    const ev={}; ['hp','atk','def','spa','spd','spe'].forEach(k=> ev[k]=Number(panel.querySelector('[data-ev-'+k+']')?.value||0));
    const stat=statBlock(nm,ev,nat,50,31);
    const moves=Array.from(panel.querySelectorAll('[data-move-input]')).map(x=>x.value.trim()).filter(Boolean);
    return {name:nm, stat, moves};
  }

  function pct(min,max,hp){ const a=Math.max(0,Math.min(100,Math.round(100*min/Math.max(1,hp)))); const b=Math.max(0,Math.min(100,Math.round(100*max/Math.max(1,hp)))); return [a,b]; }
  function koLabel(min,max,hp){
    if(hp<=0) return {label:'',cls:''};
    if(min>=hp) return {label:'確1',cls:'mtx-ohko'};
    if(max>=hp) return {label:'乱1',cls:'mtx-ohko'};
    if(min*2>=hp) return {label:'確2',cls:'mtx-thko2'};
    if(max*2>=hp) return {label:'乱2',cls:'mtx-thko2'};
    if(min*3>=hp) return {label:'確3',cls:'mtx-thko3'};
    if(max*3>=hp) return {label:'乱3',cls:'mtx-thko3'};
    return {label:'耐',cls:'mtx-chip'};
  }


  function calcSixMatrix(){
    const selfCards=Array.from(document.querySelectorAll('#self .card')), oppCards=Array.from(document.querySelectorAll('#opp .card'));
    const selfMons=selfCards.map(readMonFromPanel), oppMons=oppCards.map(readMonFromPanel);
    const mat=document.querySelector('#matrix tbody'); mat.innerHTML=''; const thead=document.querySelector('#matrix thead tr'); thead.innerHTML='<th>→</th>'+oppMons.map(m=>`<th>${m.name||'-'}</th>`).join('');
    selfMons.forEach(A=>{
      const tr=document.createElement('tr'); tr.appendChild(Object.assign(document.createElement('td'),{textContent:(A.name||'-')}));
      oppMons.forEach(B=>{
        const td=document.createElement('td');
        if(A.name && B.name && A.moves.length && !A.stat._unknown && !B.stat._unknown){
          const best=bestMoveDamage(A.stat,B.stat,{},A.moves);
          let [mi,ma]=pct(best.dmg[0],best.dmg[1],B.stat.hp);
          let dmin = best.dmg[0], dmax = best.dmg[1];
          if(best.mul===0){ mi=0; ma=0; dmin=0; dmax=0; }
          const ko = koLabel(dmin,dmax,B.stat.hp);
          td.classList.add(ko.cls||'');
          td.innerHTML = `<div class="mtx-pct">${mi}-${ma}% (${dmin}-${dmax}) ${ko.label? '· '+ko.label : ''}</div><div class="mtx-mv">${best.name||''}</div>`;
          const mulText=(best.mul===0?'×0 (無効)': `×${best.mul}`);
          const atkTypes=(A.stat.types||[]).join('/');
          const defTypes=(B.stat.types||[]).join('/');
          td.title = `${best.name||''} / ${mulText} | 攻:${atkTypes} 防:${defTypes}`;
        }else if(A.name && B.name && (A.stat._unknown || B.stat._unknown)){
          td.textContent='—//?'; td.title='ポケモンデータ未登録';
        }else{ td.textContent='—//0'; }
        tr.appendChild(td);
      });
      mat.appendChild(tr);
    });
  }

  function renderBuildCards(){
    const wrap=document.getElementById('build_cards'); wrap.innerHTML="";
    const limit=Number(document.getElementById('build_rank_max').value||100);
    const kw = document.getElementById('build_search').value.toString().trim().toLowerCase();
    const teams = buildDB.teams || [];
    let shown=0;
    teams.sort((a,b)=> (a.rank||9999)-(b.rank||9999)).forEach(t=>{
      if(t.rank && t.rank>limit) return;
      if(kw && !t.mons.some(m=> (m.name||"").toLowerCase().includes(kw))) return;
      const card=document.createElement('div'); card.className='team-card';
      const rows=t.mons.map((m,idx)=>`<tr><td>${idx+1}</td><td>${m.name||""}</td><td>${m.item||""}</td><td>${m.tera||""}</td></tr>`).join('');
      card.innerHTML = `<h4>順位: ${t.rank||'-'}</h4>
        <table class="team-table"><thead><tr><th>#</th><th>ポケモン</th><th>持ち物</th><th>テラス</th></tr></thead><tbody>${rows}</tbody></table>
        <div class="row" style="margin-top:6px">
          <button class="btn" data-apply-party>→ パーティに反映（ポケモンのみ）</button>
          <button class="btn" data-apply-opp>→ 相手6×6に反映（ポケモンのみ）</button>
        </div>`;
      card.querySelector('[data-apply-party]').addEventListener('click', ()=>{
        const party={name:`Rank${t.rank}`, members:(t.mons||[]).slice(0,6).map(m=>({name:m.name||"", nature:"てれや", evs:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0}, moves:[]}))};
        const root=document.getElementById('party'); const cards=Array.from(root.querySelectorAll('.card'));
        for(let i=0;i<6;i++){
          const c=cards[i]; if(!c) continue;
          const m=(party.members||[])[i] || {name:""};
          const nameInp=c.querySelector('[data-poke-input]'); if(nameInp){ nameInp.value=m.name||""; nameInp.dispatchEvent(new Event('change',{bubbles:true})); }
          ['hp','atk','def','spa','spd','spe'].forEach(k=>{ const el=c.querySelector('[data-ev-'+k+']'); if(el) el.value=0; });
          c.querySelectorAll('[data-move-input]').forEach(inp=>{ inp.value=""; const row=inp.closest('.row'); if(row){ const t=row.querySelector('[data-move-type]'), cat=row.querySelector('[data-move-cat]'), p=row.querySelector('[data-move-pow]'); if(t) t.value=""; if(cat) cat.value=""; if(p) p.value=""; } });
        }
        document.querySelector('.tab[data-tab="party"]').click();
      });
      card.querySelector('[data-apply-opp]').addEventListener('click', ()=>{
        const cards=Array.from(document.querySelectorAll('#opp .card'));
        (t.mons||[]).slice(0,6).forEach((m,i)=>{
          const input=cards[i]?.querySelector('[data-poke-input]');
          if(input){ input.value=m.name||""; input.dispatchEvent(new Event('change',{bubbles:true})); }
        });
        document.querySelector('.tab[data-tab="six"]').click();
      });
      wrap.appendChild(card); shown++;
    });
    document.getElementById('build_count').textContent = `表示 ${shown} 件 / 読込 ${teams.length} 件`;
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    await loadData();
    buildUI();
  });
})();
