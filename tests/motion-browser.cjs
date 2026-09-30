const {webkit,chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{for(const engine of [webkit,chromium]){const b=await engine.launch(engine===chromium?{channel:'msedge'}:{});try{
 const page=await b.newPage({viewport:{width:1180,height:600},hasTouch:true});await page.goto('file:///C:/Users/repin/Desktop/chat/index.html');await page.locator('#start-run').click();
 const report=await page.evaluate(async()=>{
  const wheel=document.querySelector('#wheel'),stage=document.querySelector('.wheel-stage'),initialStage=getComputedStyle(stage).transform;
  const tones=[],api=GameFeel.create({tone:(...args)=>tones.push(args),soundEnabled:()=>true});let rotation=0,snaps=0,backwards=0,maxAnimations=0,frames=0;const spins=[];
  for(let i=0;i<10;i++){
   const from=rotation;rotation+=1080+(i*37+19)%360;let previous=from,running=true;
   function sample(){const angle=parseFloat(wheel.style.transform.replace('rotate(',''))||0;if(angle<previous-.001)backwards++;previous=angle;frames++;maxAnimations=Math.max(maxAnimations,wheel.getAnimations().length);if(running)requestAnimationFrame(sample);}
   if(i&&parseFloat(wheel.style.transform.replace('rotate(',''))!==from)snaps++;
   requestAnimationFrame(sample);await api.spin(from,rotation,2400,37);running=false;
   spins.push(parseFloat(wheel.style.transform.replace('rotate(',''))===rotation);if(getComputedStyle(stage).transform!==initialStage)snaps++;
  }
  await new Promise(r=>setTimeout(r,200));return {spins,snaps,backwards,maxAnimations,frames,impacts:tones.filter(t=>t[0]===260).length,active:document.getAnimations().filter(a=>a.effect?.target.closest?.('.wheel-stage')).length,overflow:document.documentElement.scrollHeight>innerHeight+1};
 });assert(report.spins.every(Boolean));assert.equal(report.snaps,0);assert.equal(report.backwards,0);assert.equal(report.maxAnimations,0);assert.equal(report.impacts,10);assert.equal(report.active,0);assert.equal(report.overflow,false);assert(report.frames>100);console.log(engine.name(),report);
 }finally{await b.close();}}})().catch(e=>{console.error(e);process.exitCode=1;});
