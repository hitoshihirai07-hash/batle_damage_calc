
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
    let mtype = canonType(ctx.moveType);
    let dtypes = normTypeList(ctx.defenderTypes||[]);
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
    try{
      const mv = (typeof moveByName==='function') ? moveByName(msel.value) : null;
      if(mv){
        if(mtyp){ mtyp.value = (mv.type || mv.t || '').toString(); }
        if(mcat){ mcat.value = (mv.category || mv.c || '').toString(); }
        if(mpow){ mpow.value = Number(mv.power ?? mv.p ?? 0); }
      }
    }catch(e){ console.warn('msel change handler failed', e); }
  });
}

      if(aName){ aName.addEventListener('change', ()=>{}); }
      if(bName){ bName.addEventListener('change', ()=>{}); }
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
        /* removed auto HP rule */
  }
})();




/* removed broken injected block */
return bar;
  }

  function findCards(root){
    // try known card wrappers; otherwise any block with >=6 number inputs
    let cards=Array.from(root.querySelectorAll('.card, fieldset, .panel, .box'));
    if(cards.length===0){
      const blocks=[root.querySelectorAll('section, div')];
      cards = blocks.filter(bl=> bl.querySelectorAll('input[type="number"]').length>=6);
    }
    return cards;
  }

  function ensureBars(root){
    findCards(root).forEach(card=>{
      // rename legacy labels if存在
      card.querySelectorAll('button').forEach(b=>{
        const t=(b.textContent||'').replace(/\s+/g,'');
        if(OLD2NEW[t]) b.textContent=OLD2NEW[t];
      });
      if(!card.querySelector('.evbar7')){
        const bar=makeBar();
        const header=card.querySelector('h3,h4,.header,.title');
        if(header && header.parentNode===card) header.insertAdjacentElement('afterend',bar);
        else card.prepend(bar);
      }else{
        // fill不足
        const seen=new Set([card.querySelectorAll('.evbar7 [data-evp]')].map(x=>x.dataset.evp));
        const bar=card.querySelector('.evbar7');
        WANT.forEach(code=>{
          if(!seen.has(code)){ const b=document.createElement('button'); b.className='btn'; b.dataset.evp=code; b.textContent=code; bar.appendChild(b); }
        });
      }
    });
  }

  function findEVInputs(scope){
    const res={};
    const mapPH={'hp':'H','atk':'A','def':'B','spa':'C','spd':'D','spe':'S'};
    for(const k in mapPH){
      const el=scope.querySelector(`input[placeholder="${mapPH[k]}"]`);
      if(el) res[k]=el;
    }
    const scan=scope.querySelectorAll('input[type="number"],input[type="text"]');
    scan.forEach(el=>{
      const key=((el.name||'')+' '+(el.id||'')+' '+(el.placeholder||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.previousElementSibling?.textContent||'')).toLowerCase();
      if(!res.hp  && (key.includes('ev_h')||key.includes('hp')||/\\bh\\b/.test(key))) res.hp=el;
      if(!res.atk && (key.includes('ev_a')||key.includes('atk')||key.includes('こうげき'))) res.atk=el;
      if(!res.def && (key.includes('ev_b')||key.includes('def')||key.includes('ぼうぎょ'))) res.def=el;
      if(!res.spa && (key.includes('ev_c')||key.includes('spa')||key.includes('とくこう')||/\\bc\\b/.test(key))) res.spa=el;
      if(!res.spd && (key.includes('ev_d')||key.includes('spd')||key.includes('とくぼう')||/\\bd\\b/.test(key))) res.spd=el;
      if(!res.spe && (key.includes('ev_s')||key.includes('spe')||key.includes('すばやさ')||key.includes('素早'))) res.spe=el;
    });
    // fallback: first row with >=6 numeric inputs
    if(Object.values(res).filter(Boolean).length<6){
      const rows=[scope.querySelectorAll('.row,.ev-row,fieldset,.grid')];
      for(const row of rows){
        const nums=row.querySelectorAll('input[type="number"]');
        if(nums.length>=6){
          const order=['hp','atk','def','spa','spd','spe'];
          order.forEach((k,i)=>{ if(!res[k] && nums[i]) res[k]=nums[i]; });
          break;
        }
      }
    }
    return res;
  }

  function evMap(code){
    return {
      'HA252':{hp:252,atk:252}, 'AS252':{atk:252,spe:252}, 'HB252':{hp:252,def:252},
      'HD252':{hp:252,spd:252}, 'CS252':{spa:252,spe:252}, 'BD252':{def:252,spd:252},
      'HC252':{hp:252,spa:252}
    }[code]||{};
  }

  function apply(code, scope){
    const inputs=findEVInputs(scope);
    const evs=evMap(code);
    const els=Object.values(inputs).filter(Boolean);
    if(els.length<2) return;
    // reset all to 0
    els.forEach(el=>{ if('value' in el){ el.value=0; el.dispatchEvent(new Event('input',{bubbles:true})); }});
    // set two stats 252; others remain 0
    Object.keys(evs).forEach(k=>{ const el=inputs[k]; if(el){ el.value=evs[k]; el.dispatchEvent(new Event('input',{bubbles:true})); }});
  }

  function boot(){
    ROOTS.forEach(id=>{ const r=document.getElementById(id); if(r) ensureBars(r); });
  }
  // initial & late
  document.addEventListener('DOMContentLoaded', boot);
  setTimeout(boot, 500);
  const iv=setInterval(()=>{ let ok=false; ROOTS.forEach(id=>{ if(document.getElementById(id)) ok=true; }); if(ok){ boot(); clearInterval(iv);} }, 250);

  // global delegation for [data-evp] buttons in any root
  document.addEventListener('click', (e)=>{
    const btn=e.target.closest('[data-evp]'); if(!btn) return;
    const scope=btn.closest('.card, fieldset, .panel, .box') || document.getElementById('six') || document;
    apply(btn.dataset.evp, scope);
  });
})();
;


// v25: stronger EV input resolver within a six card
(function(){
  function findEVInputs(card){
    const result={};
    // 1) placeholder H/A/B/C/D/S
    const byPH={'hp':'H','atk':'A','def':'B','spa':'C','spd':'D','spe':'S'};
    for(const k in byPH){
      const el = card.querySelector(`input[placeholder="${byPH[k]}"]`);
      if(el) result[k]=el;
    }
    // 2) name/id heuristics
    const cand = card.querySelectorAll('input[type="number"]');
    cand.forEach(el=>{
      const key=(el.name||'')+' '+(el.id||'')+' '+(el.placeholder||'')+' '+(el.getAttribute('aria-label')||'');
      const m=(p)=> key.toLowerCase().includes(p);
      if(!result.hp && (m('ev_h') || m('hp'))) result.hp=el
      if(!result.atk && (m('ev_a') || m('atk'))) result.atk=el
      if(!result.def && (m('ev_b') || m('def'))) result.def=el
      if(!result.spa && (m('ev_c') || m('spa'))) result.spa=el
      if(!result.spd && (m('ev_d') || m('spd'))) result.spd=el
      if(!result.spe && (m('ev_s') || m('spe'))) result.spe=el
    });
    // 3) fallback: pick first 6 numeric inputs inside a row that seems EV row
    if(Object.keys(result).length<6){
      const rows = Array.from(card.querySelectorAll('.row'));
      for(const row of rows){
        const nums = row.querySelectorAll('input[type="number"]');
        if(nums.length>=6){
          const order=['hp','atk','def','spa','spd','spe'];
          order.forEach((k,i)=>{ if(!result[k] && nums[i]) result[k]=nums[i]; });
          break;
        }
      }
    }
    return result;
  }
  function applyPresetToCard(card, code){
    const map={
      'HA252':{hp:252,atk:252}, 'AS252':{atk:252,spe:252},
      'HB252':{hp:252,def:252}, 'HD252':{hp:252,spd:252},
      'CS252':{spa:252,spe:252}, 'BD252':{def:252,spd:252},
      'HC252':{hp:252,spa:252}
    };
    const evs=map[code]||{};
    const inputs=findEVInputs(card);
    const els = Object.values(inputs).filter(Boolean);
    if(els.length<2) return;
    els.forEach(el=>{ el.value=0; el.dispatchEvent(new Event('input',{bubbles:true})); });
    Object.keys(evs).forEach(k=>{ const el=inputs[k]; if(el){ el.value=evs[k]; el.dispatchEvent(new Event('input',{bubbles:true})); }});
    /* removed auto HP rule */
        }
  }
  // Delegate click from #six
  const sixRoot = document.getElementById('six');
  if(sixRoot){
    sixRoot.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-evp]');
      if(!btn) return;
      const card = btn.closest('.card') || btn.closest('[data-card]') || sixRoot;
      applyPresetToCard(card, btn.dataset.evp);
    });
  }
})();


// v27: ensure top timer handlers exist
(function(){
  const face=document.getElementById('tmr_face');
  if(!face) return;
  const btnStart=document.getElementById('tmr_start');
  const btnPause=document.getElementById('tmr_pause');
  const btnReset=document.getElementById('tmr_reset');
  const btnQuick=document.getElementById('tmr_quick20');
  const inMin=document.getElementById('tmr_min');
  const inSec=document.getElementById('tmr_sec');
  const btnSet=document.getElementById('tmr_set');
  let target=20*60*1000, remain=target, running=false, last=0, rafId=0;
  function fmt(ms){ const t=Math.max(0,Math.floor(ms)); const ds=Math.floor((t%1000)/100); const s=Math.floor(t/1000)%60; const m=Math.floor(t/60000); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${ds}`; }
  function draw(){ face.textContent=fmt(remain); face.style.animation = (remain<=10000&&running)?'blink 1s steps(2, start) infinite':''; }
  function loop(ts){ if(!running) return; if(!last) last=ts; const dt=ts-last; last=ts; remain=Math.max(0,remain-dt); draw(); if(remain<=0){ running=false; const a=new AudioContext(); const o=a.createOscillator(); o.connect(a.destination); o.frequency.value=880; o.start(); setTimeout(()=>{o.stop();a.close()},200); } else { rafId=requestAnimationFrame(loop);} }
  btnStart&& (btnStart.onclick=()=>{ if(!running){ running=true; last=0; rafId=requestAnimationFrame(loop);} });
  btnPause&& (btnPause.onclick=()=>{ running=false; cancelAnimationFrame(rafId); draw(); });
  btnReset&& (btnReset.onclick=()=>{ running=false; cancelAnimationFrame(rafId); remain=target; draw(); });
  btnQuick&& (btnQuick.onclick=()=>{ running=false; cancelAnimationFrame(rafId); target=20*60*1000; remain=target; if(inMin) inMin.value=20; if(inSec) inSec.value=0; draw(); });
  btnSet&& (btnSet.onclick=()=>{ const m=Math.max(0,Number(inMin?.value||0)); const s=Math.max(0,Math.min(59,Number(inSec?.value||0))); running=false; cancelAnimationFrame(rafId); target=(m*60+s)*1000; remain=target; draw(); });
  draw();
})();



// v28: normalize six EV preset labels to [HA252, AS252, HB252, HD252, CS252, BD252, HC252] and apply in-card
(function(){
  const six=document.getElementById('six');
  if(!six) return;
  const want=['HA252','AS252','HB252','HD252','CS252','BD252','HC252'];
  const mapOldToNew={'A252S252':'AS252','C252S252':'CS252','H252B252':'HB252','H252D252':'HD252'};

  function ensureBar(card){
    let bar = card.querySelector('.ev-presets, .six-ev, .evbar');
    if(!bar){ bar=document.createElement('div'); bar.className='ev-presets six-ev'; card.prepend(bar); }
    const exists = new Set();
    bar.querySelectorAll('button').forEach(b=>{
      const t=(b.textContent||'').replace(/\s+/g,'');
      const mapped = mapOldToNew[t] || ( /^[A-Z]{2}252$/.test(t) ? t : '' );
      if(mapped){ b.textContent=mapped; b.dataset.evp=mapped; exists.add(mapped); }
      else { b.remove(); }
    });
    want.forEach(code=>{
      if(!exists.has(code)){
        const btn=document.createElement('button');
        btn.className='btn'; btn.textContent=code; btn.dataset.evp=code;
        bar.appendChild(btn);
      }
    });
  }

  function findEVInputs(card){
    const res={};
    const byPH={'hp':'H','atk':'A','def':'B','spa':'C','spd':'D','spe':'S'};
    // 1) placeholder
    for(const k in byPH){
      const el = card.querySelector(`input[placeholder="${byPH[k]}"]`);
      if(el) res[k]=el;
    }
    // 2) heuristics by name/id/label
    const cand = card.querySelectorAll('input[type="number"], input[type="text"]');
    cand.forEach(el=>{
      const key=((el.name||'')+' '+(el.id||'')+' '+(el.placeholder||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.previousElementSibling?.textContent||'')).toLowerCase();
      if(!res.hp  && (key.includes('ev_h')  || key.includes('hp')))  res.hp=el;
      if(!res.atk && (key.includes('ev_a')  || key.includes('atk') || key.includes('こうげき'))) res.atk=el;
      if(!res.def && (key.includes('ev_b')  || key.includes('def') || key.includes('ぼうぎょ'))) res.def=el;
      if(!res.spa && (key.includes('ev_c')  || key.includes('spa') || key.includes('とくこう') || key.includes('c '))) res.spa=el;
      if(!res.spd && (key.includes('ev_d')  || key.includes('spd') || key.includes('とくぼう') || key.includes('d '))) res.spd=el;
      if(!res.spe && (key.includes('ev_s')  || key.includes('spe') || key.includes('すばやさ') || key.includes('素早'))) res.spe=el;
    });
    // 3) fallback: first row with >=6 numeric inputs
    if(Object.values(res).filter(Boolean).length<6){
      const rows = Array.from(card.querySelectorAll('.row, .ev-row, fieldset'));
      for(const row of rows){
        const nums = row.querySelectorAll('input[type="number"]');
        if(nums.length>=6){
          const order=['hp','atk','def','spa','spd','spe'];
          order.forEach((k,i)=>{ if(!res[k] && nums[i]) res[k]=nums[i]; });
          break;
        }
      }
    }
    return res;
  }

  function applyPreset(code, card){
    const map={
      'HA252':{hp:252,atk:252}, 'AS252':{atk:252,spe:252},
      'HB252':{hp:252,def:252}, 'HD252':{hp:252,spd:252},
      'CS252':{spa:252,spe:252}, 'BD252':{def:252,spd:252},
      'HC252':{hp:252,spa:252}
    };
    const evs=map[code]||{};
    const inputs=findEVInputs(card);
    const els = Object.values(inputs).filter(Boolean);
    if(els.length<2) return;
    // reset
    els.forEach(el=>{ if('value' in el){ el.value=0; el.dispatchEvent(new Event('input',{bubbles:true})); }});
    // set
    Object.keys(evs).forEach(k=>{ const el=inputs[k]; if(el){ el.value=evs[k]; el.dispatchEvent(new Event('input',{bubbles:true})); }});
    /* removed auto +0 HP rule */
  }

  six.querySelectorAll('.card').forEach(ensureBar);
  six.addEventListener('click', (e)=>{
    const btn=e.target.closest('[data-evp]');
    if(!btn) return;
    const card=btn.closest('.card')||six;
    applyPreset(btn.dataset.evp, card);
  });
})();
;


// v29: force overlay timer + robust 6x6 EV presets injection
(function(){
  // ---- Timer (overlay, always visible) ----
  function ensureTimer(){
    if(document.getElementById('bdc_timer')) return;
    const div=document.createElement('div');
    div.id='bdc_timer';
    div.innerHTML=`<div class="face" id="bdc_face">20:00.0</div>
      <button id="bdc_start">開始</button>
      <button id="bdc_pause">一時停止</button>
      <button id="bdc_reset">リセット</button>
      <button id="bdc_q20">20分に設定</button>
      <span class="inputs"><label>分</label><input type="number" id="bdc_min" value="20" min="0" style="width:70px"/>
      <label>秒</label><input type="number" id="bdc_sec" value="0" min="0" max="59" style="width:70px"/>
      <button id="bdc_set">設定</button></span>`;
    document.body.appendChild(div);
    let target=20*60*1000, remain=target, running=false, last=0, raf=0;
    const face=div.querySelector('#bdc_face'), bS=div.querySelector('#bdc_start'), bP=div.querySelector('#bdc_pause'),
          bR=div.querySelector('#bdc_reset'), bQ=div.querySelector('#bdc_q20'), bSet=div.querySelector('#bdc_set'),
          inM=div.querySelector('#bdc_min'), inS=div.querySelector('#bdc_sec');
    const fmt=(ms)=>{const t=Math.max(0,Math.floor(ms));const ds=Math.floor((t%1000)/100);const s=Math.floor(t/1000)%60;const m=Math.floor(t/60000);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${ds}`};
    const draw=()=> face.textContent=fmt(remain);
    const loop=(ts)=>{ if(!running) return; if(!last) last=ts; const dt=ts-last; last=ts; remain=Math.max(0,remain-dt); draw(); if(remain<=0){ running=false; try{const a=new AudioContext(); const o=a.createOscillator(); o.connect(a.destination); o.frequency.value=880; o.start(); setTimeout(()=>{o.stop();a.close()},200);}catch(_){} } else { raf=requestAnimationFrame(loop);} };
    bS.onclick=()=>{ if(!running){ running=true; last=0; raf=requestAnimationFrame(loop);} };
    bP.onclick=()=>{ running=false; cancelAnimationFrame(raf); draw(); };
    bR.onclick=()=>{ running=false; cancelAnimationFrame(raf); remain=target; draw(); };
    bQ.onclick=()=>{ running=false; cancelAnimationFrame(raf); target=20*60*1000; remain=target; inM.value=20; inS.value=0; draw(); };
    bSet.onclick=()=>{ const m=Math.max(0,Number(inM.value||0)); const s=Math.max(0,Math.min(59,Number(inS.value||0))); running=false; cancelAnimationFrame(raf); target=(m*60+s)*1000; remain=target; draw(); };
    draw();
  }
  // ---- 6x6 EV presets (HA/AS/HB/HD/CS/BD/HC) ----
  const CODES=['HA252','AS252','HB252','HD252','CS252','BD252','HC252'];
  function inject6x6(){
    const root=document.getElementById('six'); if(!root) return;
    // find candidate cards: any container with at least 6 numeric inputs -> treat as EV row holder
    const cards=[root.querySelectorAll('.card, fieldset, .panel, .box')];
    cards.forEach(card=>{
      const nums=card.querySelectorAll('input[type="number"]');
      if(nums.length<6) return;
      // avoid duplicate
      if(card.querySelector('.evbar7')) return;
      const bar=document.createElement('div'); bar.className='evbar7';
      CODES.forEach(code=>{ const b=document.createElement('button'); b.className='btn'; b.dataset.evp=code; b.textContent=code; bar.appendChild(b); });
      // insert near top of card
      const anchor=card.querySelector('h3,h4,.header,.title')||card.firstChild;
      if(anchor && anchor.parentNode===card) anchor.after(bar); else card.prepend(bar);
    });
    // delegation
    root.addEventListener('click', (e)=>{
      const btn=e.target.closest('[data-evp]'); if(!btn) return;
      const card=btn.closest('.card, fieldset, .panel, .box')||root;
      const inputs=findEVInputs(card);
      const ev=map(code=btn.dataset.evp);
      // reset
      Object.values(inputs).forEach(el=>{ if(el){ el.value=0; el.dispatchEvent(new Event('input',{bubbles:true})); }});
      // apply
      Object.keys(ev).forEach(k=>{ const el=inputs[k]; if(el){ el.value=ev[k]; el.dispatchEvent(new Event('input',{bubbles:true})); }});
      /* removed auto +0 HP rule */
    }, {once:false});
  }
  function map(code){
    return {'HA252':{hp:252,atk:252}, 'AS252':{atk:252,spe:252}, 'HB252':{hp:252,def:252}, 'HD252':{hp:252,spd:252},
            'CS252':{spa:252,spe:252}, 'BD252':{def:252,spd:252}, 'HC252':{hp:252,spa:252}}[code]||{};
  }
  function findEVInputs(card){
    const res={};
    const ph={'hp':'H','atk':'A','def':'B','spa':'C','spd':'D','spe':'S'};
    for(const k in ph){
      const el=card.querySelector(`input[placeholder="${ph[k]}"]`); if(el) res[k]=el;
    }
    const scan = card.querySelectorAll('input[type="number"],input[type="text"]');
    scan.forEach(el=>{
      const key=((el.name||'')+' '+(el.id||'')+' '+(el.placeholder||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.previousElementSibling?.textContent||'')).toLowerCase();
      if(!res.hp  && (key.includes('ev_h')||key.includes('hp')||key.match(/(^|\\s)h(\\s|$)/))) res.hp=el;
      if(!res.atk && (key.includes('ev_a')||key.includes('atk')||key.includes('こうげき'))) res.atk=el;
      if(!res.def && (key.includes('ev_b')||key.includes('def')||key.includes('ぼうぎょ'))) res.def=el;
      if(!res.spa && (key.includes('ev_c')||key.includes('spa')||key.includes('とくこう')||key.match(/(^|\\s)c(\\s|$)/))) res.spa=el;
      if(!res.spd && (key.includes('ev_d')||key.includes('spd')||key.includes('とくぼう')||key.match(/(^|\\s)d(\\s|$)/))) res.spd=el;
      if(!res.spe && (key.includes('ev_s')||key.includes('spe')||key.includes('すばやさ')||key.includes('素早'))) res.spe=el;
    });
    if(Object.values(res).filter(Boolean).length<6){
      const rows=[card.querySelectorAll('.row, .ev-row, fieldset, .grid')];
      for(const row of rows){
        const nums=row.querySelectorAll('input[type="number"]');
        if(nums.length>=6){ const order=['hp','atk','def','spa','spd','spe']; order.forEach((k,i)=>{ if(!res[k]&&nums[i]) res[k]=nums[i]; }); break; }
      }
    }
    return res;
  }

  // boot
  ensureTimer();
  const iv=setInterval(()=>{ const six=document.getElementById('six'); if(six){ clearInterval(iv); inject6x6(); } }, 250);
})();


// v30: normalize legacy six preset bars into unified 7-code bar (HA/AS/HB/HD/CS/BD/HC)
(function(){
  const WANT = ['HA252','AS252','HB252','HD252','CS252','BD252','HC252'];
  const MAP_OLD = {'A252S252':'AS252','C252S252':'CS252','H252B252':'HB252','H252D252':'HD252'};
  function normalizeSix(){
    const root = document.getElementById('six'); if(!root) return;
    const cards = root.querySelectorAll('.card, fieldset, .panel, .box');
    cards.forEach(card=>{
      // 1) collect candidate buttons in this card
      let btns = Array.from(card.querySelectorAll('button')).filter(b=>/\d{3}$/.test((b.textContent||'').trim()));
      if(btns.length===0) return;
      // 2) ensure single bar (.evbar7). If none, create and prepend.
      let bar = card.querySelector('.evbar7'); 
      if(!bar){ bar=document.createElement('div'); bar.className='evbar7'; card.prepend(bar); }
      const seen = new Set();
      // 3) move/rename valid buttons into bar; drop the others
      btns.forEach(b=>{
        let t=(b.textContent||'').replace(/\s+/g,'');
        // map legacy to new
        if(MAP_OLD[t]) t = MAP_OLD[t];
        // keep only our allowed codes
        if(!WANT.includes(t)) return;
        if(seen.has(t)) return; // avoid duplicates
        b.textContent=t; b.dataset.evp=t; b.classList.add('btn');
        bar.appendChild(b);
        seen.add(t);
      });
      // 4) add missing buttons
      WANT.forEach(code=>{
        if(!seen.has(code)){
          const nb=document.createElement('button');
          nb.className='btn'; nb.textContent=code; nb.dataset.evp=code;
          bar.appendChild(nb);
          seen.add(code);
        }
      });
      // 5) remove stray legacy groups inside card (anything with legacy labels still残る場合に隠す)
      Array.from(card.querySelectorAll('button')).forEach(b=>{
        const t=(b.textContent||'').replace(/\s+/g,'');
        if(!WANT.includes(t) && MAP_OLD[t]===undefined && b.closest('.evbar7')!==bar){
          // 非EV用途のボタンは触らないため、ざっくりとクラス名で限定
          if(b.closest('.ev-presets')||b.closest('.legacy-presets')){
            b.parentElement.style.display='none';
          }
        }
      });
    });
  }
  // run once and also after short delay for late DOM
  const kick = ()=>{ try{ normalizeSix(); }catch(e){ console.warn('six normalize failed', e);} };
  document.addEventListener('DOMContentLoaded', kick);
  setTimeout(kick, 600);
  const iv = setInterval(()=>{
    if(document.getElementById('six')){ kick(); clearInterval(iv); }
  }, 250);
  // delegate click remains handled by v29 injector (data-evp)
})();

// v40: minimal safe EV preset injector (252 fixed; six/party/single)
(function(){
  const WANT=['HA252','AS252','HB252','HD252','CS252','BD252','HC252'];
  function evMap(c){ return {'HA252':{hp:252,atk:252},'AS252':{atk:252,spe:252},'HB252':{hp:252,def:252},'HD252':{hp:252,spd:252},'CS252':{spa:252,spe:252},'BD252':{def:252,spd:252},'HC252':{hp:252,spa:252}}[c]||{}; }
  function ensureBar(scope){
    const cards = Array.from(scope.querySelectorAll('.card, fieldset, .panel, .box')).filter(c=> c.querySelectorAll('input[type="number"]').length>=6);
    cards.forEach(card=>{
      if(card.querySelector('.evbar7')) return;
      const bar=document.createElement('div'); bar.className='evbar7';
      WANT.forEach(code=>{ const b=document.createElement('button'); b.className='btn'; b.dataset.evp=code; b.textContent=code; bar.appendChild(b); });
      card.prepend(bar);
    });
  }
  function findEVInputs(card){
    const res={}; const sel=(k)=>card.querySelector(k);
    res.hp = sel('input[name*="_ev_h"], input#*_ev_hp, input[placeholder="H"]') || sel('input[name*="hp"][type="number"]');
    res.atk= sel('input[name*="_ev_a"], input#*_ev_atk, input[placeholder="A"]') || sel('input[name*="atk"][type="number"]');
    res.def= sel('input[name*="_ev_b"], input#*_ev_def, input[placeholder="B"]') || sel('input[name*="def"][type="number"]');
    res.spa= sel('input[name*="_ev_c"], input#*_ev_spa, input[placeholder="C"]') || sel('input[name*="spa"][type="number"]');
    res.spd= sel('input[name*="_ev_d"], input#*_ev_spd, input[placeholder="D"]') || sel('input[name*="spd"][type="number"]');
    res.spe= sel('input[name*="_ev_s"], input#*_ev_spe, input[placeholder="S"]') || sel('input[name*="spe"][type="number"]');
    return res;
  }
  function apply(code, card){
    const inputs=findEVInputs(card);
    const evs=evMap(code);
    const els=Object.values(inputs).filter(Boolean);
    if(els.length<2) return;
    els.forEach(el=>{ el.value=0; el.dispatchEvent(new Event('input',{bubbles:true})); });
    Object.keys(evs).forEach(k=>{ const el=inputs[k]; if(el){ el.value=evs[k]; el.dispatchEvent(new Event('input',{bubbles:true})); }});
  }
  function boot(){
    ['six','party','single','solo'].forEach(id=>{ const r=document.getElementById(id); if(r) ensureBar(r); });
  }
  document.addEventListener('click', (e)=>{
    const btn=e.target.closest('[data-evp]'); if(!btn) return;
    const card=btn.closest('.card, fieldset, .panel, .box')||document;
    apply(btn.dataset.evp, card);
  });
  document.addEventListener('DOMContentLoaded', boot);
  setTimeout(boot, 400);
})();
