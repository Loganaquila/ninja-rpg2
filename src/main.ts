import Phaser from 'phaser';import './style.css';
const W=2304,H=4096,MAP='/_cdn/static/0309a9da-5088-436f-b6a2-15bf6752ccb1.png',HERO='/_cdn/static/9715f668-1a39-4158-832b-5ffde4a62001.png';
type Spot={name:string,x:number,y:number,r:number,action:string};type Stats={hp:number,en:number,xp:number,rxp:number,money:number,force:number,defense:number,technique:number};
class Village extends Phaser.Scene{
 player!:Phaser.GameObjects.Container;hero?:Phaser.GameObjects.Image;label!:Phaser.GameObjects.Text;target?:Phaser.Math.Vector2;speed=245;spots:Spot[]=[];panel?:HTMLDivElement;mission=0;scrolls:string[]=[];techniques=['Pas du novice'];stats:Stats={hp:100,en:100,xp:0,rxp:0,money:150,force:12,defense:10,technique:14};
 preload(){this.load.image('village',MAP);this.load.image('hero',HERO)}
 create(){
  this.cameras.main.setBackgroundColor('#14241b');
  // Même illustration de village pixel-art utilisée dans la version Floot validée.
  const map=this.add.image(W/2,H/2,'village').setDisplaySize(W,H).setOrigin(.5).setDepth(0);map.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  // légère vignette pour retrouver l'ambiance chaude de Floot sans masquer l'illustration
  const shade=this.add.graphics().setDepth(2);shade.fillStyle(0x08120d,.10).fillRect(0,0,W,H);
  this.spots=[
   {name:'Tour du Conseil',x:1152,y:680,r:150,action:'council'},
   {name:'Bureau des missions',x:680,y:1900,r:150,action:'missions'},
   {name:'Académie',x:1650,y:1420,r:150,action:'academy'},
   {name:'Dojo',x:1710,y:2550,r:150,action:'dojo'},
   {name:'Terrain d’entraînement',x:650,y:3260,r:190,action:'training'}
  ];
  // repères intégrés au monde, style panneau pixel-art discret
  this.spots.slice(0,4).forEach(s=>{const t=this.add.text(s.x,s.y-80,s.name.toUpperCase(),{fontFamily:'monospace',fontSize:'18px',color:'#f0d083',backgroundColor:'#101914cc',padding:{x:8,y:5},stroke:'#101914',strokeThickness:2}).setOrigin(.5).setDepth(8);t.setResolution(1)});
  const shadow=this.add.ellipse(0,20,38,13,0x000000,.4);this.hero=this.add.image(0,-8,'hero').setDisplaySize(48,48).setCrop(0,0,256,256);this.hero.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  this.player=this.add.container(1152,1050,[shadow,this.hero]).setDepth(20);this.label=this.add.text(1152,995,'Aspirant III',{fontFamily:'monospace',fontSize:'13px',color:'#ffe59a',backgroundColor:'#101914bb',padding:{x:5,y:2}}).setOrigin(.5).setDepth(21);
  this.cameras.main.setBounds(0,0,W,H).startFollow(this.player,true,.09,.09);this.cameras.main.setZoom(1.05);
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{if((p.event.target as HTMLElement)?.closest?.('.ui'))return;const hit=this.spots.find(s=>Phaser.Math.Distance.Between(p.worldX,p.worldY,s.x,s.y)<s.r);this.target=new Phaser.Math.Vector2(hit?.x??p.worldX,hit?.y??p.worldY)});
  this.makeUI();
 }
 makeUI(){document.querySelectorAll('.ui').forEach(e=>e.remove());const h=document.createElement('div');h.className='ui hud floot';h.innerHTML='<b>LOGAN</b><span class="rank">ASPIRANT III</span><span>PV <i><em style="width:100%"></em></i>100/100</span><span>ÉNERGIE <i class="energy"><em style="width:100%"></em></i>100/100</span><span id="money">◈ 150 Ryō</span><span id="xp">EXP 0 · RANG 0</span>';document.body.appendChild(h);
  const q=document.createElement('div');q.className='ui mission floot';q.id='mission';q.innerHTML='<b>OBJECTIF</b><br>Rejoins le Bureau des missions.<br><small>Touche directement la carte pour te déplacer.</small>';document.body.appendChild(q);
  const nav=document.createElement('div');nav.className='ui nav floot';nav.innerHTML='<button data-p="character">🥷<small>PERSONNAGE</small></button><button data-p="tech">✦<small>TECHNIQUES</small></button><button data-p="bag">▣<small>INVENTAIRE</small></button><button data-p="missions">📜<small>MISSIONS</small></button>';document.body.appendChild(nav);nav.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>this.openPanel((b as HTMLElement).dataset.p||'')))}
 openPanel(k:string){this.panel?.remove();const p=document.createElement('div');p.className='ui panel floot';this.panel=p;let body='';if(k==='character')body='<h3>LOGAN · ASPIRANT III</h3><div class="stats"><b>PV</b><span>100</span><b>Énergie</b><span>100</span><b>Force</b><span>12</span><b>Défense</b><span>10</span><b>Technique</b><span>14</span></div>';if(k==='tech')body='<h3>TECHNIQUES</h3>'+this.techniques.map(x=>'◆ '+x).join('<br>');if(k==='bag')body='<h3>INVENTAIRE</h3>◇ Potion de soin<br>◇ Kunai ×3'+this.scrolls.map(x=>'<br>◇ Parchemin : '+x).join('');if(k==='missions')body='<h3>MISSIONS</h3>'+(this.mission===0?'Aucune mission active':this.mission===1?'Rang D · Épreuve du terrain':'Mission terminée ✓');p.innerHTML='<button class="close">×</button>'+body;document.body.appendChild(p);p.querySelector('.close')?.addEventListener('click',()=>p.remove())}
 interact(s:Spot){if(s.action==='missions'){if(this.mission===0){this.mission=1;this.note('Mission D acceptée · rejoins le Terrain d’entraînement.')}else this.note('Le Bureau attend ton rapport.')}else if(s.action==='training'&&this.mission===1)this.completeMission();else if(s.action==='council')this.note('Conseil Ninja · promotions majeures et examens de rang.');else if(s.action==='academy')this.note('Académie · entraînement des Aspirants.');else if(s.action==='dojo')this.note('Dojo · entraînement tactique.')}
 completeMission(){this.mission=2;this.stats.xp+=120;this.stats.rxp+=60;this.stats.money+=180;this.scrolls.push('Pas Éclair');this.note('Mission réussie ! +120 EXP · +60 EXP Rang · +180 Ryō · Parchemin Pas Éclair.');this.refresh()}
 refresh(){const m=document.getElementById('money'),x=document.getElementById('xp');if(m)m.textContent='◈ '+this.stats.money+' Ryō';if(x)x.textContent='EXP '+this.stats.xp+' · RANG '+this.stats.rxp}
 note(t:string){const m=document.getElementById('mission');if(m)m.innerHTML='<b>OBJECTIF</b><br>'+t}
 update(_:number,dt:number){this.label.setPosition(this.player.x,this.player.y-55);if(!this.target)return;const dx=this.target.x-this.player.x,dy=this.target.y-this.player.y,d=Math.hypot(dx,dy);if(d<16){const s=this.spots.find(v=>Phaser.Math.Distance.Between(this.player.x,this.player.y,v.x,v.y)<170);if(s)this.interact(s);this.target=undefined;return}const step=Math.min(d,this.speed*dt/1000);this.player.x=Phaser.Math.Clamp(this.player.x+dx/d*step,35,W-35);this.player.y=Phaser.Math.Clamp(this.player.y+dy/d*step,35,H-35)}
}
new Phaser.Game({type:Phaser.AUTO,parent:'app',width:960,height:540,backgroundColor:'#101914',scene:Village,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{pixelArt:true,antialias:false,roundPixels:true}});
