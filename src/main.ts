import Phaser from 'phaser';import './style.css';
const W=4096,H=4096;
type Spot={name:string,x:number,y:number,r:number,msg:string};
class Village extends Phaser.Scene{
 player!:Phaser.GameObjects.Container;label!:Phaser.GameObjects.Text;target?:Phaser.Math.Vector2;speed=260;
 obstacles:Phaser.Geom.Rectangle[]=[];spots:Spot[]=[];
 create(){
  const g=this.add.graphics();this.cameras.main.setBackgroundColor('#203d2d');
  // sol pixel-art: herbe + petites touffes
  g.fillStyle(0x315c3d).fillRect(0,0,W,H);
  for(let y=32;y<H;y+=64)for(let x=24;x<W;x+=72){const n=(x*13+y*7)%31;if(n<8){g.fillStyle(n%2?0x3b6946:0x294f36);g.fillRect(x+n,y+n,4,10);g.fillRect(x+n+5,y+n+4,4,7)}}
  // rivière avec berges pixelisées
  g.fillStyle(0x213e35).fillRect(0,1748,W,364);g.fillStyle(0x376b72).fillRect(0,1780,W,300);
  for(let x=30;x<W;x+=90){g.fillStyle(0x4d8584,.55).fillRect(x,1830+(x%4)*45,42,5)}
  g.fillStyle(0x213e35).fillRect(2568,0,324,H);g.fillStyle(0x376b72).fillRect(2600,0,260,H);
  // chemins de terre, sans grille visible
  const road=(x:number,y:number,w:number,h:number)=>{g.fillStyle(0x756445).fillRect(x,y,w,h);g.fillStyle(0x9b8355).fillRect(x+10,y+10,w-20,h-20);for(let i=0;i<Math.floor((w+h)/70);i++){g.fillStyle(0xb09762).fillRect(x+18+(i*83)%Math.max(30,w-40),y+18+(i*47)%Math.max(30,h-40),12,7)}};
  road(0,900,W,230);road(1880,0,250,H);road(0,2850,W,200);
  // ponts en bois
  const bridge=(x:number,y:number,w:number,h:number)=>{g.fillStyle(0x4a3326).fillRect(x-12,y-12,w+24,h+24);g.fillStyle(0xa77b48).fillRect(x,y,w,h);if(w>h)for(let xx=x;xx<x+w;xx+=28)g.fillStyle(0x6e4b32).fillRect(xx,y,5,h);else for(let yy=y;yy<y+h;yy+=28)g.fillStyle(0x6e4b32).fillRect(x,yy,w,5)};
  bridge(1880,1780,250,300);bridge(2600,900,260,230);bridge(2600,2850,260,200);
  const building=(x:number,y:number,w:number,h:number,roof=0x6f3f35)=>{
   // ombre, murs, toit en tuiles pixel-art, porte
   g.fillStyle(0x16271f,.55).fillRect(x+14,y+18,w,h);g.fillStyle(0xb18a61).fillRect(x,y+28,w,h-28);
   g.fillStyle(roof).fillRect(x-12,y,w+24,48);g.fillStyle(0x3e2925).fillRect(x-4,y+8,w+8,8);
   for(let xx=x+8;xx<x+w;xx+=28){g.fillStyle(0x8c5745).fillRect(xx,y+17,18,6)}
   g.fillStyle(0x493127).fillRect(x+w/2-17,y+h-45,34,45);g.fillStyle(0xd2aa55).fillRect(x+w/2+7,y+h-25,4,4);
   this.obstacles.push(new Phaser.Geom.Rectangle(x-12,y,w+24,h-12));
  };
  // quartiers résidentiels plus cohérents
  const homes=[[240,420],[520,430],[820,430],[1120,430],[280,1220],[610,1230],[970,1220],[3100,1150],[3400,1160],[3100,3200],[3450,3220],[1200,2400],[1450,2450]];
  homes.forEach((p,i)=>building(p[0],p[1],180+(i%2)*30,125,i%3===0?0x70483a:0x654036));
  // bâtiments majeurs
  building(1780,360,450,245,0x6b3832);g.fillStyle(0xc49a4b).fillRect(1930,300,150,55);g.fillStyle(0x51322c).fillRect(1950,315,110,22);
  building(3100,470,470,230,0x514554);building(430,2350,520,220,0x5d4538);building(3150,2300,430,215,0x4d3933);
  const title=(x:number,y:number,t:string)=>this.add.text(x,y,t,{fontFamily:'monospace',fontSize:'20px',color:'#f0cc70',stroke:'#17241c',strokeThickness:5}).setOrigin(.5).setDepth(8);
  title(2005,650,'TOUR DU CONSEIL');title(3335,740,'ACADÉMIE');title(690,2610,'BUREAU DES MISSIONS');title(3365,2555,'DOJO');
  // terrain d'entraînement
  g.lineStyle(8,0x7d623d).strokeRect(420,3230,920,570);for(let i=0;i<6;i++){g.fillStyle(0x765238).fillRect(540+i*125,3460+(i%2)*70,18,70);g.fillStyle(0xc1a06a).fillCircle(549+i*125,3445+(i%2)*70,24)}title(880,3290,'TERRAIN D’ENTRAÎNEMENT');
  // arbres pixel-art en grappes
  for(let i=0;i<220;i++){const x=50+(i*337)%3970,y=70+(i*593)%3940;if((y>1680&&y<2170)||(x>2500&&x<2960)||Math.abs(x-2005)<310&&y<800)continue;g.fillStyle(0x172f23).fillRect(x-7,y+13,14,22);g.fillStyle(0x1e4930).fillRect(x-23,y-14,46,34);g.fillStyle(0x2e7042).fillRect(x-16,y-23,32,38);g.fillStyle(0x438354).fillRect(x-9,y-18,15,13)}
  this.spots=[
   {name:'Conseil Ninja',x:2005,y:675,r:110,msg:'Conseil Ninja — promotions majeures et examens de rang.'},
   {name:'Bureau des missions',x:690,y:2630,r:120,msg:'Bureau des missions — une mission de rang D est disponible.'},
   {name:'Académie',x:3335,y:760,r:120,msg:'Académie Ninja — entraînement des Aspirants.'},
   {name:'Dojo',x:3365,y:2580,r:120,msg:'Dojo — entraînement au combat tactique.'}
  ];
  // petit sprite ninja pixel-art dessiné par blocs
  const sh=this.add.ellipse(0,15,28,10,0x000000,.35),legs=this.add.rectangle(0,8,18,15,0x1c2930),torso=this.add.rectangle(0,-3,22,22,0x263d52),head=this.add.rectangle(0,-20,18,16,0xc88f68),hair=this.add.rectangle(0,-28,20,8,0x1b1d22),band=this.add.rectangle(0,-23,22,5,0xc79b42);
  this.player=this.add.container(2005,900,[sh,legs,torso,head,hair,band]).setDepth(30);this.label=this.add.text(2005,855,'Aspirant III',{fontFamily:'monospace',fontSize:'13px',color:'#ffe59a',stroke:'#000',strokeThickness:4}).setOrigin(.5).setDepth(31);
  this.cameras.main.setBounds(0,0,W,H).startFollow(this.player,true,.1,.1);this.cameras.main.setZoom(1.2);
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{const hit=this.spots.find(a=>Phaser.Math.Distance.Between(p.worldX,p.worldY,a.x,a.y)<a.r);this.target=new Phaser.Math.Vector2(hit?.x??p.worldX,hit?.y??p.worldY)});
  this.makeHud();
 }
 makeHud(){document.querySelectorAll('.hud,.mission').forEach(e=>e.remove());const h=document.createElement('div');h.className='hud';h.innerHTML='<span class="pill">🥷 Aspirant III</span><span class="pill">❤️ PV 100/100</span><span class="pill">⚡ Énergie 100/100</span><span class="pill">💰 150 Ryō</span><span class="pill">EXP 0</span><span class="pill">Rang 0</span>';document.body.appendChild(h);const m=document.createElement('div');m.className='mission';m.id='mission';m.innerHTML='<b>Mission actuelle</b><br>Va à la Tour du Conseil.<br><small>Touche/clic uniquement pour te déplacer.</small>';document.body.appendChild(m)}
 notify(t:string){const m=document.getElementById('mission');if(m)m.innerHTML='<b>Interaction</b><br>'+t}
 blocked(x:number,y:number){return this.obstacles.some(r=>Phaser.Geom.Rectangle.Contains(r,x,y))}
 update(_:number,dt:number){this.label.setPosition(this.player.x,this.player.y-45);if(!this.target)return;const dx=this.target.x-this.player.x,dy=this.target.y-this.player.y,d=Math.hypot(dx,dy);if(d<18){const a=this.spots.find(v=>Phaser.Math.Distance.Between(this.player.x,this.player.y,v.x,v.y)<135);if(a)this.notify(a.msg);this.target=undefined;return}const s=Math.min(d,this.speed*dt/1000),nx=this.player.x+dx/d*s,ny=this.player.y+dy/d*s;if(!this.blocked(nx,ny)){this.player.x=Phaser.Math.Clamp(nx,20,W-20);this.player.y=Phaser.Math.Clamp(ny,20,H-20)}else{if(!this.blocked(nx,this.player.y))this.player.x=nx;else if(!this.blocked(this.player.x,ny))this.player.y=ny;else this.target=undefined}}
}
new Phaser.Game({type:Phaser.AUTO,parent:'app',width:960,height:540,backgroundColor:'#17251d',scene:Village,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{pixelArt:true,antialias:false,roundPixels:true}});
