(()=>{
const canvas=document.getElementById('publishingCanvas');if(!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const stage=document.querySelector('.publishing-network'),core=document.getElementById('intelligenceCore'),status=document.getElementById('coreStatus'),caption=document.getElementById('networkCaption'),pause=document.getElementById('networkPause'),help=document.getElementById('flowHelp');
const buttons=[...document.querySelectorAll('[data-network]')],motion=matchMedia('(prefers-reduced-motion: reduce)');
let w=1,h=1,phase=0,last=0,raf=0,visible=false,paused=false,mode=0,morph=0,pulse=-10,coreHover=false,influence=0,heat=0;
let pointer={x:0,y:0,active:false},smooth={x:0,y:0};
const captions=['Connected content flows through one intelligent center.','Every lesson gains context, relationships, and lineage.','Connected knowledge becomes purpose-built assessments.'];
const globalPaused=()=>document.documentElement.classList.contains('motion-paused');
const active=()=>visible&&!paused&&!globalPaused()&&!motion.matches&&!document.hidden;
const cx=()=>w*.5,cy=()=>h*.55;
function linePoint(t,lane){
 const envelope=Math.sin(Math.PI*t);
 const blend=t*t*(3-2*t);
 const inlet=Math.round(lane*2)/2;
 const activeLane=inlet*(1-blend)+lane*blend;
 const spread=(.22+.78*blend)*(1-.62*Math.exp(-Math.pow((t-.5)/.15,2)));
 const variantWave=(Math.sin(t*Math.PI*2)*(1-morph*.32)+Math.sin(t*Math.PI*3)*morph*.22)*h*.08;
 let x=w*(-.06+1.12*t),y=cy()+variantWave+activeLane*h*(.27+morph*.06)*spread+Math.sin(phase*.16+t*4+lane)*1.5*envelope;
 const dx=x-smooth.x,dy=y-smooth.y;
 const reach=Math.exp(-(dx*dx+dy*dy)/(2*170*170));
 y+=(smooth.y-cy())*.035*reach*influence;
 x+=(smooth.x-cx())*.01*reach*influence;
 return {x,y};
}
function draw(){
 ctx.clearRect(0,0,w,h);ctx.lineCap='round';const count=w<600?16:24;
 const age=phase-pulse,energy=age>=0&&age<4?Math.sin(age/4*Math.PI):0;
 for(let i=0;i<count;i++){
  const lane=(i/(count-1)-.5)*2;
  const points=Array.from({length:97},(_,j)=>linePoint(j/96,lane));
  const trace=()=>{ctx.beginPath();points.forEach((p,j)=>j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));};
  const near=pointer.active?Math.exp(-Math.pow((linePoint(.35,lane).y-smooth.y)/100,2))*influence:0;
  trace();ctx.strokeStyle=`rgba(199,119,77,${.015+near*.012})`;ctx.lineWidth=4;ctx.stroke();
  trace();ctx.strokeStyle=`rgba(193,133,101,${.035+near*.025})`;ctx.lineWidth=2;ctx.stroke();
  trace();ctx.strokeStyle=`rgba(180,119,91,${.17+near*.08})`;ctx.lineWidth=.55;ctx.stroke();
  for(let k=0;k<1;k++){
   const t=(phase*(.019+mode*.0015)+(i*.618+k*.5))%1;
   const fade=Math.min(1,t*10,(1-t)*10);
   const p=linePoint(t,lane);
   const shine=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,5+energy*2);shine.addColorStop(0,`rgba(243,113,54,${fade*.16})`);shine.addColorStop(.3,`rgba(243,113,54,${fade*.05})`);shine.addColorStop(1,'rgba(255,174,108,0)');ctx.fillStyle=shine;ctx.fillRect(p.x-15,p.y-15,30,30);
   ctx.beginPath();for(let j=0;j<=12;j++){const q=linePoint(Math.max(0,t-.032+j*.032/12),lane);j?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.strokeStyle=`rgba(221,129,85,${fade*(.35+energy*.1)})`;ctx.lineWidth=.9;ctx.stroke();
   ctx.fillStyle=`rgba(226,103,46,${fade*.65})`;ctx.beginPath();ctx.arc(p.x,p.y,1.05,0,Math.PI*2);ctx.fill();
  }
 }
 const glow=ctx.createRadialGradient(cx(),cy(),10,cx(),cy(),w<600?135:220);glow.addColorStop(0,`rgba(255,175,112,${.025+heat*.01+energy*.01})`);glow.addColorStop(1,'rgba(255,140,90,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 core.style.setProperty('--core-energy',String(heat+energy*.4));
}
function tick(now){raf=0;if(!active()){last=0;return;}const dt=last?Math.min((now-last)/1000,.05):0;last=now;phase+=dt;morph+=(mode-morph)*(1-Math.exp(-dt*2));const ease=1-Math.exp(-dt*3);influence+=((pointer.active?1:0)-influence)*ease;heat+=((coreHover?1:0)-heat)*ease;smooth.x+=(pointer.x-smooth.x)*ease;smooth.y+=(pointer.y-smooth.y)*ease;draw();const dx=(smooth.x-cx())/w*influence,dy=(smooth.y-cy())/h*influence;core.style.transform=`translate(calc(-50% + ${dx*3}px),calc(-50% + ${dy*2}px))`;core.style.setProperty('--glint-x',`${35+dx*8}%`);core.style.setProperty('--glint-y',`${25+dy*8}%`);raf=requestAnimationFrame(tick);}
function sync(){const stopped=paused||globalPaused();pause.setAttribute('aria-pressed',String(stopped));pause.textContent=stopped?'Resume animation ▷':'Pause animation Ⅱ';if(active()){if(!raf){last=0;raf=requestAnimationFrame(tick);}}else{cancelAnimationFrame(raf);raf=0;last=0;core.style.transform='translate(-50%,-50%)';draw();}}
function resize(){const r=stage.getBoundingClientRect();w=r.width;h=r.height;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);draw();}
function move(e){const r=stage.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;if(!pointer.active){smooth.x=pointer.x;smooth.y=pointer.y;}pointer.active=true;if(!active())draw();}
stage.addEventListener('pointermove',move);stage.addEventListener('pointerdown',move);stage.addEventListener('pointerleave',()=>{pointer.active=false;coreHover=false;stage.dataset.coreActive='false';if(!active())draw();});
stage.addEventListener('pointerup',e=>{if(e.pointerType==='touch'){pointer.active=false;if(!active())draw();}});
function hover(on){coreHover=on;stage.dataset.coreActive=String(on);status.textContent=on?'Mapping context · Applying rules':'Connect · Understand · Orchestrate';if(!active())draw();}
core.addEventListener('pointerenter',()=>hover(true));core.addEventListener('pointerleave',()=>hover(false));core.addEventListener('focus',()=>hover(true));core.addEventListener('blur',()=>hover(false));
core.addEventListener('click',()=>{pulse=phase;status.textContent='Context mapped. Connected outputs ready.';caption.textContent='A connected revision travels from source to every dependent output.';draw();});
core.addEventListener('keydown',e=>{const delta={ArrowLeft:[-28,0],ArrowRight:[28,0],ArrowUp:[0,-28],ArrowDown:[0,28]}[e.key];if(delta){e.preventDefault();if(!pointer.active){pointer.x=cx();pointer.y=cy();}pointer.active=true;pointer.x=Math.max(0,Math.min(w,pointer.x+delta[0]));pointer.y=Math.max(0,Math.min(h,pointer.y+delta[1]));smooth.x=pointer.x;smooth.y=pointer.y;draw();}});
buttons.forEach((b,i)=>b.addEventListener('click',()=>{mode=i;if(!active())morph=mode;buttons.forEach((el,j)=>{el.classList.toggle('active',i===j);el.setAttribute('aria-pressed',String(i===j));});caption.textContent=captions[i];pulse=phase;draw();}));
pause.addEventListener('click',()=>{if(globalPaused()){document.documentElement.classList.remove('motion-paused');const all=document.getElementById('motionToggle');all.setAttribute('aria-pressed','false');all.textContent='Pause motion Ⅱ';paused=false;}else paused=!paused;sync();});
if(matchMedia('(pointer: coarse)').matches)help.textContent='Touch the flow. Tap Kadal to send a light pulse.';else help.textContent='Explore the flow with your cursor. Select Kadal to send a light pulse.';
new ResizeObserver(resize).observe(stage);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(stage);new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);resize();
})();
