'use strict';
// Presentation layer and independent counterfactual experiments.
// The original optimizer remains the sole source of allocation decisions.
(function(){
const el=id=>document.getElementById(id);
const scenarios=[['Vehicle loss','vehicle'],['Access loss','access'],['Demand surge','surge'],['Supply loss','supply']];
function showRegions(){
 if(!latest||!latest.result)return;
 const target=el('regionVisual');target.replaceChildren();
 latest.result.rows.forEach((r)=>{
 const item=document.createElement('article');item.className='region';
 const head=document.createElement('div');head.className='regionhead';
 const name=document.createElement('strong');name.textContent=r.name;
 const summary=document.createElement('span');summary.className='muted';summary.textContent=r.served+' / '+r.demand+' served · risk '+r.risk+'/5';
 head.append(name,summary);
 const track=document.createElement('div');track.className='bar';const bar=document.createElement('div');bar.style.width=(100*r.served/r.demand)+'%';track.append(bar);
 const resources=document.createElement('div');resources.className='resource-line';
 [['Vehicles',r.vehicles],['Teams',r.teams],['Supply kits',r.kits]].forEach(([k,v])=>{const s=document.createElement('span');const b=document.createElement('b');b.textContent=v;s.append(b,' '+k.toLowerCase());resources.append(s);});
 item.append(head,track,resources);target.append(item);
 });
 el('study').replaceChildren();
}
const original=render;render=function(){original();showRegions();};
showRegions();
el('stress').onclick=()=>{
 const target=el('study');target.replaceChildren();
 try{
 const baseState=E.clone(state);const base=E.run(baseState).result;
 const outcomes=scenarios.map(([label,type])=>{const test=E.run(E.event(baseState,type));return {label,utility:test.result.utility,base:test.base.utility,served:test.result.served,demand:test.result.demand,valid:test.result.valid};});
 const worst=outcomes.reduce((a,b)=>a.utility<=b.utility?a:b);
 const max=Math.max(1,base.utility,...outcomes.map(x=>x.utility));
 const summary=document.createElement('p');summary.className='insight';
 summary.textContent='Most adverse tested event: '+worst.label+' · utility '+worst.utility+' vs '+base.utility+' before disruption.';
 target.append(summary);
 [['Current plan',base.utility],...outcomes.map(x=>[x.label,x.utility])].forEach(([label,value])=>{
 const row=document.createElement('div');row.className='studyrow';const n=document.createElement('span');n.textContent=label;
 const track=document.createElement('div');track.className='bar';const b=document.createElement('div');b.style.width=100*value/max+'%';track.append(b);const v=document.createElement('b');v.textContent=value;row.append(n,track,v);target.append(row);
 });
 const note=document.createElement('p');note.className='muted';note.textContent='All four scenarios independently re-optimized; '+outcomes.filter(x=>x.valid).length+'/4 feasible. Optimized utility meets or exceeds equal-share in '+outcomes.filter(x=>x.utility>=x.base).length+'/4 cases. Scores across changed demand or risk are descriptive, not like-for-like impact estimates.';
 target.append(note);
 const save=document.createElement('button');save.textContent='Export experiment data';save.onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({model:'SENTINEL v2.0',state:baseState,original:base,outcomes},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='sentinel-resilience.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};target.append(save);
 }catch(e){target.textContent='Experiment failed: '+e.message;}
};
})();
