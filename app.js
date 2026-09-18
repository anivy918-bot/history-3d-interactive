import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const eras = [
  ["夏","约前2070—前1600年","早期国家文明的形成","二里头文化与早期国家形态"],
  ["商","约前1600—前1046年","青铜文明","甲骨文、青铜器与王权"],
  ["西周","前1046—前771年","分封制与礼乐制度","宗法、分封、礼乐"],
  ["春秋战国","前770—前221年","百家争鸣与社会变革","铁器牛耕、诸子百家、兼并战争"],
  ["秦","前221—前207年","统一多民族国家建立","郡县制、统一文字货币、长城"],
  ["汉","前202—220年","统一多民族国家巩固","丝绸之路、汉文化发展"],
  ["三国两晋南北朝","220—589年","政权分立与民族交融","人口迁徙、民族交往交流交融"],
  ["隋","581—618年","短暂统一与制度建设","大运河、科举制"],
  ["唐","618—907年","开放繁荣的盛世","长安、丝绸之路、文化交流"],
  ["宋","960—1279年","经济文化高度发展","活字印刷、指南针、城市商业"],
  ["元","1271—1368年","统一多民族国家发展","行省制、海陆交通"],
  ["明","1368—1644年","专制集权与对外交流","郑和下西洋、长城"],
  ["清","1644—1912年","统一多民族国家进一步发展","疆域奠定、近代转型"]
];

const info = {
  "秦": {
    title:"秦 · 咸阳",
    desc:"公元前221年，秦王嬴政完成统一，建立我国历史上第一个统一的多民族封建国家。",
    facts:["政治：推行郡县制，加强中央集权","经济：统一货币、度量衡","文化：统一文字，促进政令与文化交流","工程：修筑长城、建设驰道等"]
  },
  "汉": {title:"汉 · 长安",desc:"汉朝在继承秦制的基础上进一步发展，统一多民族国家得到巩固与发展。",facts:["张骞通西域","丝绸之路沟通东西方","儒学地位不断提升","手工业与农业发展"]},
  "唐": {title:"唐 · 长安城",desc:"唐代长安是当时重要的国际性城市，呈现开放、多元的社会风貌。",facts:["科举制进一步发展","中外文化交流活跃","诗歌艺术成就突出","城市规划严整"]},
  "宋": {title:"宋 · 汴京",desc:"宋代商品经济和城市生活高度发展，科技发明对后世产生重要影响。",facts:["活字印刷术","指南针应用发展","火药广泛用于军事","城市商业繁荣"]},
  "明": {title:"明 · 北京",desc:"明代统一多民族国家继续发展，对外交流和海洋活动也留下重要历史印记。",facts:["郑和下西洋","长城防御体系发展","内阁制度形成与发展","商品经济发展"]},
  "清": {title:"清 · 紫禁城",desc:"清朝前期统一多民族国家进一步发展，奠定了现代中国疆域的重要基础。",facts:["统一台湾","平定边疆地区叛乱","册封与管理西藏","疆域进一步巩固"]}
};

const scene = document.querySelector("#scene");
const renderer = new THREE.WebGLRenderer({canvas:scene, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled = true;

const camera = new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,1000);
camera.position.set(16,12,18);

const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.target.set(0,2,0);
controls.minDistance = 7;
controls.maxDistance = 40;

const world = new THREE.Scene();
world.background = new THREE.Color(0x07070b);
world.fog = new THREE.FogExp2(0x07070b,.018);

const hemi = new THREE.HemisphereLight(0xb6c8ff,0x24180d,2.0);
world.add(hemi);
const moon = new THREE.DirectionalLight(0xffe2a3,3.0);
moon.position.set(8,18,10); moon.castShadow=true; world.add(moon);

const ground = new THREE.Mesh(
  new THREE.CylinderGeometry(13,13,.5,96),
  new THREE.MeshStandardMaterial({color:0x2a2017,roughness:.95})
);
ground.position.y=-.25; ground.receiveShadow=true; world.add(ground);

function mat(c,metal=0,rough=.65){return new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});}
const gold=mat(0xc8a64d,.45,.4), stone=mat(0x77716a,0,.9), dark=mat(0x241b16,0,.8), red=mat(0x6f241b);

function box(name,x,y,z,sx,sy,sz,material=stone){
  const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);
  m.position.set(x,y,z);m.name=name;m.castShadow=true;m.receiveShadow=true;world.add(m);return m;
}
function cylinder(name,x,y,z,r,h,material=stone,seg=32){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),material);
  m.position.set(x,y,z);m.name=name;m.castShadow=true;m.receiveShadow=true;world.add(m);return m;
}

function clearScene(){
  [...world.children].forEach(o=>{
    if(o.userData.keep) return;
    if(o.isMesh || o.isGroup || o.isPoints) world.remove(o);
  });
}

function makeStars(){
  const geo=new THREE.BufferGeometry();
  const arr=[];
  for(let i=0;i<1300;i++){
    const r=35+Math.random()*45, a=Math.random()*Math.PI*2, y=(Math.random()-.5)*50;
    arr.push(Math.cos(a)*r,y,Math.sin(a)*r);
  }
  geo.setAttribute("position",new THREE.Float32BufferAttribute(arr,3));
  const p=new THREE.Points(geo,new THREE.PointsMaterial({color:0xe8d9ae,size:.08}));
  p.userData.keep=true; world.add(p);
}
makeStars();

function buildQin(){
  clearScene();
  world.add(ground);
  // palace
  box("咸阳宫",0,2.2,0,9,4,6,red);
  box("宫殿台基",0,.55,0,11,1,8,stone);
  for(let x=-4;x<=4;x+=2) for(let z=-2.5;z<=2.5;z+=2.5) cylinder("宫柱",x,3.5,z,.28,3.2,gold,20);
  box("屋顶",0,4.55,0,10.5,.55,7,gold);
  // great wall
  for(let i=-10;i<=10;i++) box("长城",i*.85,1.1,-8,.82,2.2,.8,stone);
  for(let i=-10;i<=10;i++) box("垛口",i*.85,2.55,-8,.38,.55,.82,gold);
  // emperor
  cylinder("秦始皇",5,1.5,3,.75,3.0,dark);
  cylinder("冠冕",5,3.2,3,.9,.35,gold);
  // terracotta army
  for(let row=0;row<4;row++) for(let col=0;col<7;col++){
    const x=-5+col*1.5,z=4+row*1.15;
    const s=groupSoldier(x,z);
    s.name="兵马俑";
  }
  // road
  box("驰道",0,.05,5,15,.1,2.2,mat(0x463522));
}
function groupSoldier(x,z){
  const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(.55,1.25,.42),mat(0x8b765c));
  body.position.y=.8; g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),mat(0x9c8667));
  head.position.y=1.65;g.add(head);
  const base=new THREE.Mesh(new THREE.BoxGeometry(.7,.18,.55),stone);base.position.y=.1;g.add(base);
  g.position.set(x,0,z);g.traverse(o=>o.castShadow=true);world.add(g);return g;
}

function buildGeneric(dynasty){
  clearScene(); world.add(ground);
  const palette={汉:0x553226,唐:0x633018,宋:0x34505a,明:0x3d2020,清:0x27434a}[dynasty]||0x4a3a2b;
  box(`${dynasty}宫殿`,0,2.2,0,10,4,6,mat(palette));
  box("台基",0,.55,0,12,1,8,stone);
  for(let x=-4;x<=4;x+=2) cylinder("宫柱",x,3.5,2,.25,3,gold,20);
  box("屋顶",0,4.5,0,11,.55,7,gold);
  for(let x=-7;x<=7;x+=1.4) cylinder("城市建筑",x,.9,-7,.45,1.8,mat(0x66564a));
  for(let i=0;i<18;i++){
    const a=Math.random()*Math.PI*2,r=7+Math.random()*5;
    cylinder("城市",Math.cos(a)*r,.7,Math.sin(a)*r,.5,1.4+Math.random()*2,mat(0x5d5148));
  }
}

let current="秦";
buildQin();

const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();

renderer.domElement.addEventListener("pointerdown",e=>{
  pointer.x=(e.clientX/innerWidth)*2-1;
  pointer.y=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(world.children,true);
  const hit=hits.find(h=>h.object.name && !["宫柱","城市","城市建筑"].includes(h.object.name));
  if(hit) showObject(hit.object.name);
});

function showObject(name){
  const map={
    "咸阳宫":["咸阳宫","秦朝都城宫殿建筑的互动示意。点击不同对象，可以了解秦统一后的国家治理。"],
    "长城":["长城","秦统一后把原有北方长城连接、修缮，形成重要的防御工程。"],
    "秦始皇":["秦始皇","秦王嬴政统一六国后称皇帝，建立中央集权国家制度。"],
    "兵马俑":["兵马俑","秦始皇陵兵马俑反映了秦代雕塑、军事组织和陵墓制度等历史信息。"],
    "驰道":["驰道","秦统一后修筑道路网络，有利于政令传达、交通与国家治理。"]
  };
  if(map[name]){
    document.querySelector("#sceneTitle").textContent=map[name][0];
    document.querySelector("#sceneDesc").textContent=map[name][1];
    document.querySelector("#facts").innerHTML="<div class='fact'>互动提示：可继续拖动、缩放场景，从不同角度观察。</div>";
  }
}

function renderInfo(d){
  const x=info[d]||{title:d,desc:"正在建设该历史时期的3D互动场景。",facts:["可从时间轴切换历史时期","后续可加入更多城市、人物与文物"]};
  document.querySelector("#sceneTitle").textContent=x.title;
  document.querySelector("#sceneDesc").textContent=x.desc;
  document.querySelector("#facts").innerHTML=x.facts.map(v=>`<div class="fact">${v}</div>`).join("");
}

const timeline=document.querySelector("#timeline");
eras.forEach(([name,date,desc])=>{
  const b=document.createElement("button");
  b.className="era"+(name===current?" active":"");
  b.innerHTML=`<b>${name}</b><br><small>${date}</small>`;
  b.onclick=()=>{
    document.querySelectorAll(".era").forEach(x=>x.classList.remove("active"));b.classList.add("active");
    current=name;
    if(name==="秦") buildQin(); else buildGeneric(name);
    renderInfo(name);
    camera.position.set(16,12,18);controls.target.set(0,2,0);
  };
  timeline.appendChild(b);
});
renderInfo("秦");

const questions=[
  {q:"秦统一六国发生在哪一年？",a:["公元前221年","公元前202年","公元618年","公元960年"],c:0},
  {q:"秦朝在地方实行什么重要制度？",a:["分封制","郡县制","行省制","刺史制度"],c:1},
  {q:"汉代著名的对外交流通道是？",a:["丝绸之路","茶马古道","大运河","京杭铁路"],c:0},
  {q:"唐代重要的国际性城市是？",a:["咸阳","长安","汴京","临安"],c:1}
];
let qi=0,score=0;
const quiz=document.querySelector("#quiz");
function showQuestion(){
  const x=questions[qi];
  document.querySelector("#question").textContent=x.q;
  document.querySelector("#result").textContent=`第 ${qi+1} / ${questions.length} 题`;
  const box=document.querySelector("#options");box.innerHTML="";
  x.a.forEach((t,i)=>{
    const b=document.createElement("button");b.className="option";b.textContent=t;
    b.onclick=()=>{
      if(i===x.c){score++;document.querySelector("#result").textContent="回答正确 ✓";}
      else document.querySelector("#result").textContent="再想一想。";
      setTimeout(()=>{
        qi++;
        if(qi<questions.length) showQuestion();
        else {
          document.querySelector("#question").textContent=`挑战完成：${score} / ${questions.length}`;
          box.innerHTML="";
          document.querySelector("#result").textContent="可以关闭窗口继续探索历史场景。";
        }
      },650);
    };box.appendChild(b);
  });
}
document.querySelector("#quizBtn").onclick=()=>{qi=0;score=0;quiz.classList.add("show");showQuestion()};
document.querySelector("#closeQuiz").onclick=()=>quiz.classList.remove("show");

let teacher=false;
document.querySelector("#teacherMode").onclick=e=>{
  teacher=!teacher;
  e.currentTarget.textContent=`教师课堂模式：${teacher?"开":"关"}`;
  document.querySelector(".bottom-hint").style.opacity=teacher?".82":"1";
};

addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(world,camera);
}
animate();
setTimeout(()=>document.querySelector("#loading").style.display="none",900);
