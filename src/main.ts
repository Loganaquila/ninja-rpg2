import Phaser from 'phaser';import './style.css';

const W=4096,H=4096;
class Village extends Phaser.Scene{
 player!:Phaser.GameObjects.Container; target?:Phaser.Math.Vector2; speed=250;
 create(){
  this.cameras.main.setBackgroundColor('#294936');this.physics.world.setBounds(0,0,W,H);
  const g=this.add.graphics();
  g.fillStyle(0x31563d).fillRect(0,0,W,H);
  // rivers
  g.fillStyle(0x315d68).fillRect(0,1780,W,300);g.fillStyle(0x315d68).fillRect(2600,0,260,W,H);
  // roads
  g.fillStyle(0x9b8052);g.fillRect(0,900,W,230);g.fillRect(1880,0,250,H);g.fillRect(0,2850,W,200);
  // districts + buildings
  const buildings=[...Array(85)].map((_,i)=>({x:220+(i*431)%3500,y:220+(i*719)%3400}));
  buildings.forEach((b,i)=>{if((b.y>1680&&b.y<2150)||(b.x>2500&&b.x<2940))return;g.fillStyle(i%3===0?0x7b4937:0x694336);g.fillRect(b.x,b.y,120+(i%4)*20,85);g.fillStyle(0x3b2924);g.fillTriangle(b.x-10,b.y,b.x+70,b.y-55,b.x+150,b.y);});
  // council tower
  g.fillStyle(0x55352d).fillCircle(2005,560,155);g.fillStyle(0xd0a34d).fillCircle(2005,560,112);g.fillStyle(0x5d3a2d).fillCircle(2005,560,70);
  this.add.text(2005,730,'TOUR DU CONSEIL',{fontSize:'28px',color:'#f4d57d',stroke:'#182219',strokeThickness:6}).setOrigin(.5);
  // training ground
  g.lineStyle(8,0xd0a34d).strokeRect(530,3200,700,520);this.add.text(880,3450,'TERRAIN\nD’ENTRAÎNEMENT',{align:'center',fontSize:'25px',color:'#f4d57d',stroke:'#182219',strokeThickness:6}).setOrigin(.5);
  // trees
  for(let i=0;i<230;i++){const x=60+(i*337)%3980,y=70+(i*593)%3950;if(Math.abs(x-2005)<260&&Math.abs(y-560)<250)continue;g.fillStyle(0x193d29).fillCircle(x,y,22);g.fillStyle(0x2f7041).fillCircle(x-5,y-8,17);}
  // player
  const shadow=this.add.ellipse(0,14,30,12,0x000000,.35);const body=this.add.circle(0,0,13,0x263c57).setStrokeStyle(3,0xe0b34d);const head=this.add.circle(0,-17,9,0xd6a276);const band=this.add.rectangle(0,-20,20,5,0x3b5268);this.player=this.add.container(2005,900,[shadow,body,head,band]).setDepth(20);
  this.cameras.main.setBounds(0,0,W,H);this.cameras.main.startFollow(this.player,true,.09,.09);this.cameras.main.setZoom(1.15);
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.target=new Phaser.Math.Vector2(p.worldX,p.worldY);});
  this.add.text(2005,840,'Aspirant III',{fontSize:'15px',color:'#ffe59a',stroke:'#000',strokeThickness:4}).setOrigin(.5).setDepth(21);
  this.makeHud();
 }
 makeHud(){const hud=document.createElement('div');hud.className='hud';hud.innerHTML='<span class="pill">🥷 Aspirant III</span><span class="pill">❤️ PV 100/100</span><span class="pill">⚡ Énergie 100/100</span><span class="pill">💰 150 Ryō</span><span class="pill">EXP 0</span><span class="pill">Rang 0</span>';document.body.appendChild(hud);const m=document.createElement('div');m.className='mission';m.innerHTML='<b>Mission actuelle</b><br>Va à la Tour du Conseil.<br><small>Touche/clic uniquement pour te déplacer.</small>';document.body.appendChild(m)}
 update(_:number,dt:number){if(!this.target)return;const dx=this.target.x-this.player.x,dy=this.target.y-this.player.y,d=Math.hypot(dx,dy);if(d<7){this.target=undefined;return}const step=Math.min(d,this.speed*dt/1000);this.player.x+=dx/d*step;this.player.y+=dy/d*step;this.player.x=Phaser.Math.Clamp(this.player.x,20,W-20);this.player.y=Phaser.Math.Clamp(this.player.y,20,H-20)}
}
new Phaser.Game({type:Phaser.AUTO,parent:'app',width:960,height:540,backgroundColor:'#17251d',scene:Village,scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{pixelArt:true,antialias:false}});
