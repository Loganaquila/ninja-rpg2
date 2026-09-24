import Phaser from 'phaser';import './style.css';
const W=4096,H=4096;
type Zone={name:string,x:number,y:number,w:number,h:number,color:number};
class Village extends Phaser.Scene{
 player!:Phaser.GameObjects.Container;label!:Phaser.GameObjects.Text;target?:Phaser.Math.Vector2;speed=260;
 obstacles:Phaser.Geom.Rectangle[]=[]; interactables:{name:string,x:number,y:number,r:number,msg:string}[]=[];
 create(){
  this.cameras.main.setBackgroundColor('#294936');const g=this.add.graphics();g.fillStyle(0x31563d).fillRect(0,0,W,H);
  // eau + ponts
  g.fillStyle(0x315d68).fillRect(0,1780,W,300);g.fillRect(2600,0,260,H);
  g.fillStyle(0x9b8052).fillRect(0,900,W,230);g.fillRect(1880,0,250,H);g.fillRect(0,2850,W,200);
  g.fillStyle(0xa98d5b).fillRect(1880,1780,250,300);g.fillRect(2600,900,260,230);g.fillRect(2600,2850,260,200);
  const zones:Zone[]=[
   {name:'QUARTIER DU CONSEIL',x:1500,y:180,w:1000,h:620,color:0x4c6848},
   {name:'MARCHÉ',x:260,y:1180,w:1100,h:430,color:0x526746},
   {name:'ACADÉMIE',x:3050,y:300,w:720,h:620,color:0x48604a},
   {name:'DOJO',x:3050,y:2200,w:720,h:500,color:0x4c6043},
   {name:'BUREAU DES MISSIONS',x:250,y:2250,w:1000,h:430,color:0x506349},
   {name:'TERRAIN D’ENTRAÎNEMENT',x:450,y:3200,w:1000,h:620,color:0x486a43}
  ];
  zones.forEach(z=>{g.fillStyle(z.color,.72).fillRoundedRect(z.x,z.y,z.w,z.h,30);g.lineStyle(5,0xd0a34d,.7).strokeRoundedRect(z.x,z.y,z.w,z.h,30);this.add.text(z.x+z.w/2,z.y+25,z.name,{fontSize:'20px',color:'#f4d57d',stroke:'#182219',strokeThickness:5}).setOrigin(.5,0)});
  const addBuilding=(x:number,y:number,w:number,h:number,c=0x754a39)=>{g.fillStyle(c).fillRect(x,y,w,h);g.fillStyle(0x392821).fillTriangle(x-14,y,x+w/2,y-48,x+w+14,y);g.fillStyle(0xc89a49).fillRect(x+w/2-14,y+h-30,28,30);this.obstacles.push(new Phaser.Geom.Rectangle(x-12,y-50,w+24,h+50));};
  for(let i=0;i<62;i++){const x=130+(i*487)%3650,y=200+(i*673)%3500;if((y>1650&&y<2150)||(x>2450&&x<3000)||Math.abs(x-2000)<300&&y<900)continue;addBuilding(x,y,105+(i%4)*22,78+(i%3)*10,i%3===0?0x80503b:0x684235)}
  // Conseil, académie, bureau et dojo
  addBuilding(1840,410,330,190,0x63392f);g.fillStyle(0xd0a34d).fillCircle(2005,420,78);g.fillStyle(0x5b352d).fillCircle(2005,420,48);
  addBuilding(3200,520,360,190,0x5b4651);addBuilding(520,2390,420,170,0x604638);addBuilding(3200,2350,350,180,0x533c34);
  this.interactables=[
   {name:'Conseil Ninja',x:2005,y:640,r:100,msg:'Conseil Ninja — Les promotions majeures seront validées ici.'},
   {name:'Bureau des missions',x:730,y:2600,r:110,msg:'Bureau des missions — Les missions de rang seront disponibles ici.'},
   {name:'Académie',x:3380,y:750,r:110,msg:'Académie — Entraînement et préparation des Aspirants.'},
   {name:'Dojo',x:3380,y:2580,r:110,msg:'Dojo — Zone d’entraînement au combat.'}
  ];
  // arbres
  for(let i=0;i<250;i++){const x=55+(i*337)%3980,y=65+(i*593)%3950;if((y>1720&&y<2140)||(x>2520&&x<2940))continue;g.fillStyle(0x193d29).fillCircle(x,y,23);g.fillStyle(0x327647).fillCircle(x-5,y-9,17)}
  // terrain
  for(let i=0;i<7;i++){g.fillStyle(0x8b6a43).fillCircle(590+i*120,3520+(i%2)*55,18)}
  const shadow=this.add.ellipse(0,14,30,12,0x000000,.35),body=this.add.circle(0,0,13,0x263c57).setStrokeStyle(3,0xe0b34d),head=this.add.circle(0,-17,9,0xd6a276),band=this.add.rectangle(0,-20,20,5,0x3b5268);
  this.player=this.add.container(2005,900,[shadow,body,head,band]).setDepth(30);this.label=this.add.text(2005,860,'Aspirant III',{fontSize:'14px',color:'#ffe59a',stroke:'#000',strokeThickness:4}).setOrigin(.5).setDepth(31);
  this.cameras.main.setBounds(0,0,W,H).startFollow(this.player,true,.1,.1);this.cameras.main.setZoom(1.15);
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{const hit=this.interactables.find(a=>Phaser.Math.Distance.Between(p.worldX,p.worldY,a.x,a.y)<a.r);this.target=new Phaser.Math.Vector2(hit?.x??p.worldX,hit?.y??p.worldY);if(hit)this.target.set(hit.x,hit.y)});
  this.makeHud();
 }
 makeHud(){document.querySelectorAll('.hud,.mission').forEach(e=>e.remove());const h=document.createElement('div');h.className='hud';h.innerHTML='<span class="pill">🥷 Aspirant III</span><span class="pill">❤️ PV 100/100</span><span class="pill">⚡ Énergie 100/100</span><span class="pill">💰 150 Ryō</span><span class="pill">EXP 0</span><span class="pill">Rang 0</span>';document.body.appendChild(h);const m=document.createElement('div');m.className='mission';m.id='mission';m.innerHTML='<b>Mission actuelle</b><br>Va à la Tour du Conseil.<br><small>Touche un lieu pour t’y rendre.</small>';document.body.appendChild(m)}
 notify(t:string){const m=document.getElementById('mission');if(m)m.innerHTML='<b>Interaction</b><br>'+t}
 blocked(nx:number,ny:number){return this.obstacles.some(r=>Phaser.Geom.Rectangle.Contains(r,nx,ny))}
 update(_:number,dt:number){this.label.setPosition(this.player.x,this.player.y-42);if(!this.target)return;const dx=this.target.x-this.player.x,dy=this.target.y-this.player.y,d=Math.hypot(dx,dy);if(d<18){const a=this.interactables.find(v=>Phaser.Math.Distance.Between(this.player.x,this.player.y,v.x,v.y)<125);if(a)this.notify(a.msg);this.target=undefined;return}const s=Math.min(d,this.speed*dt/1000),nx=this.player.x+dx/d*s,ny=this.player.y+dy/d*s;if(!this.blocked(nx,ny)){this.player.x=Phaser.Math.Clamp(nx,20,W-20);this.player.y=Phaser.Math.Clamp(ny,20,H-20)}else{const ax=this.player.x+dx/d*s;if(!this.blocked(ax,this.player.y))this.player.x=ax;else{const ay=this.player.y+dy/d*s;if(!this.blocked(this.player.x,ay))this.player.y=ay;else this.target=undefined}}}
}
new Phaser.Game({type:Phaser.AUTO,parent:'app',width:960,height:540,backgroundColor:'#17251d',scene:Village,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{pixelArt:true,antialias:false}});
