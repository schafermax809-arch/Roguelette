// WebKit regression: real Safari bars reduce available height below device presets.
const {webkit,chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url'),g=require('../script.js');
const out=path.resolve(__dirname,'../test-results/safari-viewport');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const measurements=[];
 for(const engine of (process.env.ENGINE?[process.env.ENGINE]:['webkit','chromium'])){
  const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{headless:true}:{headless:true,channel:'msedge'});
  try{
   const context=await browser.newContext({viewport:{width:1180,height:720},hasTouch:true,isMobile:true,deviceScaleFactor:1,reducedMotion:'reduce'});
   const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
   await p.locator('#start-run').tap();
   async function check(label){
    const m=await p.evaluate(()=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
     const selectors=['.app','.topbar','.table-heading','.game-layout','.bets-panel','.wheel-panel','.stats-panel','.inventory','.wheel-stage','#chips','#spin','#status','#boss-banner'];
     return {width:innerWidth,height:innerHeight,pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,
      circles:['.wheel-shell','#wheel','.wheel-hub'].map(s=>{const e=document.querySelector(s);return {s,w:e.offsetWidth,h:e.offsetHeight};}),
      boxes:Object.fromEntries(selectors.map(s=>[s,rect(document.querySelector(s))])),
      controls:[...document.querySelectorAll('.app button')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>{
       const r=rect(e),hit=document.elementFromPoint(r.x+r.w/2,r.y+r.h/2);
       return {id:e.id||e.className,...r,reachable:e.contains(hit),cover:hit?.id||hit?.className,panel:rect(e.closest('.panel')||document.querySelector('.app'))};
      }),
      wrappers:['html','body','.app','.game-layout'].map(s=>({s,overflow:getComputedStyle(document.querySelector(s)).overflow,transform:getComputedStyle(document.querySelector(s)).transform}))};
    });
    measurements.push({engine,label,...m});
    assert(m.pageWidth<=m.width+1,label+' page horizontal overflow');
    assert(m.pageHeight<=m.height+1,label+' page vertical overflow: '+m.pageHeight);
    for(const c of m.circles)assert(Math.abs(c.w-c.h)<=1,label+' squeezed wheel '+JSON.stringify(c));
    for(const [s,r] of Object.entries(m.boxes))if(r.w&&r.h){assert(r.y>=-1&&r.bottom<=m.height+1,label+' outside viewport '+s+JSON.stringify(r));}
    // Grid children must actually fit their cells, not just the document's bounds.
    assert(m.boxes['.bets-panel'].bottom<=m.boxes['.inventory'].y+1,label+' bets overlap inventory');
    assert(m.boxes['.wheel-panel'].bottom<=m.boxes['.inventory'].y+1,label+' wheel overlaps inventory');
    assert(m.boxes['.wheel-panel'].right<=m.boxes['.bets-panel'].x&&m.boxes['.bets-panel'].right<=m.boxes['.stats-panel'].x,label+' keep three columns');
    assert(m.boxes['.wheel-stage'].y>=m.boxes['.wheel-panel'].y-1,label+' wheel exceeds its grid row');
    for(const r of m.controls){assert(r.y>=0&&r.bottom<=m.height+1&&r.x>=0&&r.right<=m.width+1,label+' clipped control '+JSON.stringify(r));assert(r.reachable,label+' covered control '+r.id+' by '+r.cover);assert(r.y>=r.panel.y-5&&r.bottom<=r.panel.bottom+5,label+' control outside panel '+r.id);}
    assert(m.wrappers.every(s=>!['hidden','clip'].includes(s.overflow)&&s.transform==='none'),label+' must fit without masking/scaling');
   }
   async function sweep(label){for(const height of [820,780,744,720,700,680,650,600]){await p.setViewportSize({width:1180,height});await check(label+'-'+height);}}
   await sweep('basic');
   await p.setViewportSize({width:1180,height:720});
   await p.locator('#chips [data-chip="0"]').tap();await p.locator('#peek-action').tap();await p.locator('#outside-bets .bet-target').first().tap();
   await sweep('placed');
   await p.screenshot({path:path.join(out,engine+'-table.png')});
   await p.locator('#spin').tap();await p.waitForFunction(()=>!document.querySelector('#spin').disabled);if(await p.locator('#room-receipt').isVisible())await p.keyboard.press('Escape');
   await sweep('resolved');
   await p.reload();await p.locator('#resume-run').tap();await check('reload');
   // A full build, every betting row occupied, a long boss rule and legacy tokens.
   const s=g.createState(()=>0);s.floor=4;s.map=g.createFloorMap(4,()=>0);
   const boss=s.map.at(-1)[0];Object.assign(s,{currentRoom:boss.id,mapStep:s.map.length-1,visited:[boss.id],target:boss.target,spinsLeft:boss.spins});
   s.chips=g.CHIP_CATALOG.slice(0,6).map((c,id)=>g.createChip(c,id));s.nextChipId=6;
   s.relics=Object.keys(g.RELIC_TYPES).slice(0,4).map((name,id)=>({name,id}));s.nextRelicId=4;
   s.items=[{id:0,name:'Rewrite'},{id:1,name:'Duplicate'}];s.nextItemId=2;
   s.history=s.wheel.slice(1,9);s.tokens=[{id:0,name:Object.keys(g.TOKEN_TYPES)[0]}];s.nextTokenId=1;
   async function seed(state){const save=g.encodeRun(state,null,null);assert(g.decodeRun(save).ok);await p.evaluate(v=>localStorage.setItem('roguelette-run-v1',v),save);await p.reload();await p.locator('#resume-run').tap();}
   await seed(s);await sweep('boss-unplaced-build');
   for(let i=0;i<6;i++)g.placeBet(s,i,i<2?'outside':'number',i===0?'red':i===1?'even':[0,0,0,1,7,13][i]);
   const saved=g.encodeRun(s,null,null);assert(g.decodeRun(saved).ok,'fixture must be a valid resumable save');
   await p.evaluate(save=>localStorage.setItem('roguelette-run-v1',save),saved);await p.reload();await p.locator('#resume-run').tap();
   assert(await p.locator('#boss-banner').isVisible());
   await sweep('boss-full-build');
   await p.setViewportSize({width:1180,height:680});await p.screenshot({path:path.join(out,engine+'-boss.png')});
   // All three columns remain present on iPad Pro landscape sizes as well.
   for(const [width,height]of [[1194,734],[1210,734],[1366,924],[1376,932]]){await p.setViewportSize({width,height});await check('pro-'+width);}
   await p.setViewportSize({width:1180,height:720});await p.locator('#spin').tap();await p.waitForFunction(()=>!document.querySelector('#spin').disabled);if(await p.locator('#room-receipt').isVisible())await p.keyboard.press('Escape');await sweep('boss-resolved');
   await p.setViewportSize({width:820,height:1180});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'portrait horizontal fit');
   await p.setViewportSize({width:1180,height:720});await check('rotation-back');
   await p.locator('#outside-bets .chip-element').first().tap();await p.locator('#peek-action').tap();assert.equal(await p.locator('#outside-bets .chip-element').count(),1,'placed chip returns after explicit action');
   assert.deepEqual(errors,[]);
   await context.close();
  }finally{await browser.close();}
 }
 fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify(measurements,null,2));
 console.log('PASS Safari viewport fit, placement, spin, resize and reload');
})().catch(e=>{console.error(e);process.exitCode=1;});
