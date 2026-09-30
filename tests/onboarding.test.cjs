const test=require('node:test'),assert=require('node:assert/strict'),g=require('../script.js'),o=require('../onboarding.js');
test('Bet preview uses current wheel odds and scoring without altering state or RNG',()=>{
 const s=g.createState(()=>0),before=JSON.stringify(s),random=Math.random;Math.random=()=>{throw Error('Preview must not roll');};
 try{let p=g.previewBet(s,0,'outside','red');assert.equal(p.hits,9);assert.equal(p.total,19);assert.equal(p.min,20);assert.equal(p.max,20);assert.equal(g.previewBet(s,0,'number',7).min,100);assert.equal(g.previewBet(s,0,'number',0).min,75);assert.equal(JSON.stringify(s),before);}finally{Math.random=random;}
 s.wheel.push({number:7,color:'black'});assert.equal(g.previewBet(s,0,'number',7).hits,2);assert.equal(g.previewBet(s,0,'outside','black').hits,10);
});
test('Preview agrees with resolved scoring for every chip, mutation, relic and winning field',()=>{
 for(const def of g.CHIP_CATALOG){const s=g.createState(()=>0);s.chips=[g.createChip(def,0)];s.chips[0].mutations=['Polished','Echo'];s.relics=[{id:0,name:'Lucky Seven'},{id:1,name:'Blood Pact'}];s.nextRelicId=2;
  for(const [type,value] of [['outside','red'],['number',0],['number',7]]){const p=g.previewBet(s,0,type,value),original=JSON.stringify(s);
   for(const r of s.wheel.filter(r=>g.checkWin({type,value},r)))for(const rng of [()=>0,()=>.999999]){const copy=structuredClone(s);g.placeBet(copy,0,type,value);g.startSpin(copy);g.resolveSpin(copy,r,rng);assert(copy.spinScore>=p.min&&copy.spinScore<=p.max,def.name);}
   assert.equal(JSON.stringify(s),original);
  }
 }
});
test('Preview includes next streak, full placed build, boss taxes and bounded random curse',()=>{
 const s=g.createState(()=>0);s.chips=[g.createChip(g.CHIP_TYPES[5],0),g.createChip(g.CHIP_TYPES[1],1)];s.chips[0].streak=3;g.placeBet(s,1,'outside','red');let p=g.previewBet(s,0,'outside','red');assert.equal(p.min,70);assert(p.multiple);
 g.grantCurse(s,0,'Volatile');p=g.previewBet(s,0,'outside','red');assert.equal(p.min,70);assert.equal(p.max,150);assert(p.varies);
});
test('Onboarding storage validates status and discovered concepts',()=>{assert.equal(o.normalize(null).status,'new');assert.deepEqual(o.normalize({status:'skipped',seen:['shop','invalid']}).seen,['shop']);assert.equal(o.normalize({status:'completed'}).status,'completed');});
