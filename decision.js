'use strict';
// Independent resource sensitivity analysis. All counterfactuals use the verified engine.
(function(){
const $d=id=>document.getElementById(id);
const keys=['vehicles','teams','kits'];
const names={vehicles:'Vehicles',teams:'Rescue teams',kits:'Supply kits'};
const text=(tag,value,cls)=>{const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e;};
function analyze(s,budget){
 const original=E.run(s).result;
 const candidates=[];
 for(let v=0;v<=budget;v++)for(let t=0;t<=budget-v;t++)for(let k=0;k<=budget-v-t;k++){
  if(!v&&!t&&!k)continue;
  const next=E.clone(s);const add={vehicles:v,teams:t,kits:k};
  if(keys.some(x=>next.resources[x]+add[x]>16))continue;
  keys.forEach(x=>next.resources[x]+=add[x]);
  const p=E.run(next).result;
  candidates.push({add,utility:p.utility,gain:p.utility-original.utility,served:p.served,covered:p.covered,units:v+t+k,valid:p.valid});
 }
 candidates.sort((a,b)=>b.gain-a.gain||a.units-b.units||b.covered-a.covered||b.served-a.served);
 return {original,candidates,best:candidates[0]||null};
}
function run(){
 const target=$d('decisionResults');target.replaceChildren();
 try{
 const snapshot=E.clone(state);const budget=Number($d('investmentBudget').value);
 const report=analyze(snapshot,budget);const best=report.best;
 if(!best){target.append(text('p','All resource budgets are at their model limits.','muted'));return;}
 const recommendation=text('div','','recommendation');
 recommendation.append(text('span','RECOMMENDED RESOURCE MIX','eyebrow'),text('h3',best.gain>0?'+'+best.gain+' utility points':'No positive gain found'));
 recommendation.append(text('p',keys.map(k=>'+'+best.add[k]+' '+names[k].toLowerCase()).join(' · ')));
 recommendation.append(text('p',report.candidates.length+' feasible resource mixes evaluated · '+best.served+' demand units served','muted'));
 target.append(recommendation);
 const max=Math.max(1,...report.candidates.map(x=>x.gain));
 keys.forEach(k=>{
 const solo=report.candidates.find(x=>x.units===1&&x.add[k]===1);
 const row=text('div','','studyrow');
 row.append(text('span',names[k]));
 const track=text('div','','bar');const bar=text('div','');bar.style.width=solo?100*solo.gain/max+'%':'0%';track.append(bar);
 row.append(track,text('b',solo?'+'+solo.gain:'Limit'));target.append(row);
 });
 target.append(text('p','Single-unit gains above isolate marginal value. Bundles may reveal complementary resources. Each additional unit has equal assumed cost; this is not a financial ROI estimate.','muted'));
 const apply=text('button','Apply recommendation');apply.className='primary';apply.disabled=best.gain<=0;apply.onclick=()=>guarded(()=>{
 if(JSON.stringify(state)!==JSON.stringify(snapshot))throw Error('Mission changed. Run the analysis again.');
 state=E.clone(snapshot);keys.forEach(k=>state.resources[k]+=best.add[k]);previous=latest.result;fill();$d('event').textContent='Resource recommendation applied';execute('Decision lab: resource investment');
 selectView('mission');
 });target.append(apply);
 const exportBtn=text('button','Export decision evidence');exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify({state:snapshot,budget,...report},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='sentinel-decision-lab.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};target.append(exportBtn);
 }catch(e){target.append(text('p',e.message,'warn'));}
}
function selectView(view){
 document.querySelectorAll('[data-view-panel]').forEach(e=>e.hidden=e.dataset.viewPanel!==view);
 document.querySelectorAll('[data-view]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.view===view)));
}
document.querySelectorAll('[data-view]').forEach(e=>e.onclick=()=>selectView(e.dataset.view));
$d('investmentRun').onclick=run;
const oldRender=render;render=function(){oldRender();$d('decisionResults').replaceChildren();};
selectView('mission');
})();
