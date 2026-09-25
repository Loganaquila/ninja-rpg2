extends Node2D

var player: CharacterBody2D
var faction := "Sans faction"
var faction_label: Label
var quest_label: Label

func _ready():
    _build_island()
    _build_player()
    _build_ui()

func rect(pos:Vector2,size:Vector2,color:Color,name:String="Decor",z:=0):
    var p=Polygon2D.new()
    p.name=name; p.position=pos; p.z_index=z; p.color=color
    p.polygon=PackedVector2Array([Vector2(-size.x/2,-size.y/2),Vector2(size.x/2,-size.y/2),Vector2(size.x/2,size.y/2),Vector2(-size.x/2,size.y/2)])
    add_child(p)

func circle(pos:Vector2,r:float,color:Color,name:String="Decor",z:=0):
    var p=Polygon2D.new(); var pts=PackedVector2Array()
    for i in range(16): pts.append(Vector2(cos(i*TAU/16.0),sin(i*TAU/16.0))*r)
    p.polygon=pts; p.position=pos; p.color=color; p.name=name; p.z_index=z; add_child(p)

func _build_island():
    # Océan et grande île tropicale 2D
    rect(Vector2(0,0),Vector2(1800,1300),Color("42b9d1"),"Ocean",-20)
    rect(Vector2(0,-40),Vector2(1350,900),Color("66b86b"),"Island",-15)
    rect(Vector2(0,390),Vector2(1250,130),Color("edcf85"),"Beach",-14)
    # Routes et place centrale
    rect(Vector2(0,80),Vector2(95,650),Color("d7bd83"),"MainRoad",-10)
    rect(Vector2(0,30),Vector2(380,230),Color("d7bd83"),"VillageSquare",-10)
    # Village : maisons avec façades et toits
    for y in [-240,-80,150]:
        for x in [-470,-300,300,470]:
            _house(Vector2(x,y))
    # Taverne pirate et bureau Marine
    _building(Vector2(-245,230),Vector2(190,125),Color("9a5a36"),Color("c94f3e"),"TAVERNE PIRATE")
    _building(Vector2(250,225),Vector2(205,135),Color("e8e4d6"),Color("4f79ad"),"MARINE")
    # Marché
    for x in [-150,-50,50,150]:
        rect(Vector2(x,-55),Vector2(70,45),Color("b66d3e"),"Market",2)
        rect(Vector2(x,-80),Vector2(78,18),Color("e9bd52"),"Awning",3)
    # Port et quais
    for x in [-390,-210,0,210,390]:
        rect(Vector2(x,500),Vector2(95,230),Color("7c5638"),"Dock",1)
        for yy in [410,470,540,600]: circle(Vector2(x-40,yy),7,Color("4e321f"),"Post",2)
    _ship(Vector2(-390,635))
    _ship(Vector2(260,655))
    # Forêt tropicale dense au nord
    for y in [-410,-330,-260]:
        for x in range(-570,571,95):
            if abs(x)<120 and y>-350: continue
            _tree(Vector2(x+((int(y)/10)%2)*25,y))
    # Falaises / zone boss
    for x in range(-560,561,80):
        circle(Vector2(x,-500),45,Color("687264"),"Cliff",-5)
    rect(Vector2(0,-405),Vector2(300,150),Color("806b4c"),"BossClearing",-8)
    _enemy(Vector2(-55,-405),"Bandit",45)
    _enemy(Vector2(65,-405),"Bandit",45)
    _enemy(Vector2(0,-470),"Capitaine Brise-Fer",180)
    _recruiter(Vector2(-245,300),"Pirate")
    _recruiter(Vector2(250,300),"Marine")

func _house(pos:Vector2):
    rect(pos,Vector2(145,95),Color("dfb36e"),"House",1)
    rect(pos+Vector2(0,-55),Vector2(165,42),Color("b94e3d"),"Roof",3)
    rect(pos+Vector2(0,25),Vector2(30,45),Color("70452f"),"Door",4)
    circle(pos+Vector2(-42,0),13,Color("8ed3e5"),"Window",4)

func _building(pos:Vector2,size:Vector2,body:Color,roof:Color,title:String):
    rect(pos,size,body,title,1); rect(pos+Vector2(0,-size.y/2-18),Vector2(size.x+18,38),roof,"Roof",3)
    rect(pos+Vector2(0,25),Vector2(38,55),Color("65412c"),"Door",4)

func _tree(pos:Vector2):
    rect(pos+Vector2(0,18),Vector2(16,45),Color("73502e"),"Trunk",0)
    circle(pos,34,Color("287b45"),"Palm",2); circle(pos+Vector2(22,-8),25,Color("349454"),"Leaves",3)

func _ship(pos:Vector2):
    rect(pos,Vector2(145,48),Color("5b3825"),"ShipHull",2)
    rect(pos+Vector2(0,-45),Vector2(8,95),Color("49301f"),"Mast",3)
    rect(pos+Vector2(32,-55),Vector2(58,62),Color("f2e5c2"),"Sail",3)

func _enemy(pos:Vector2,title:String,hp:int):
    var e=StaticBody2D.new(); e.position=pos; e.name=title; e.set_meta("hp",hp); e.z_index=8
    var shape=CollisionShape2D.new(); var capsule=CapsuleShape2D.new(); capsule.radius=15; capsule.height=38; shape.shape=capsule; e.add_child(shape)
    var body=Polygon2D.new(); body.color=Color("67263a") if hp<100 else Color("301823"); body.polygon=PackedVector2Array([Vector2(-14,-20),Vector2(14,-20),Vector2(18,20),Vector2(-18,20)]); e.add_child(body); add_child(e)

func _recruiter(pos:Vector2,side:String):
    var a=Area2D.new(); a.position=pos; a.set_meta("side",side); a.z_index=8
    var cs=CollisionShape2D.new(); var s=CircleShape2D.new(); s.radius=55; cs.shape=s; a.add_child(cs)
    var body=Polygon2D.new(); body.color=Color("8b352d") if side=="Pirate" else Color("e9eef5"); body.polygon=PackedVector2Array([Vector2(-15,-22),Vector2(15,-22),Vector2(18,22),Vector2(-18,22)]); a.add_child(body); add_child(a)
    a.body_entered.connect(func(b): if b==player: _choose_faction(side))

func _build_player():
    player=CharacterBody2D.new(); player.name="Logan"; player.position=Vector2(0,330); player.set_script(load("res://scripts/player.gd")); player.z_index=10
    var cs=CollisionShape2D.new(); var s=CapsuleShape2D.new(); s.radius=15; s.height=42; cs.shape=s; player.add_child(cs)
    var body=Polygon2D.new(); body.color=Color("244d78"); body.polygon=PackedVector2Array([Vector2(-15,-22),Vector2(15,-22),Vector2(18,22),Vector2(-18,22)]); player.add_child(body)
    var cam=Camera2D.new(); cam.position_smoothing_enabled=true; cam.position_smoothing_speed=6; cam.zoom=Vector2(.9,.9); player.add_child(cam); add_child(player)

func _build_ui():
    var layer=CanvasLayer.new(); add_child(layer)
    var panel=ColorRect.new(); panel.color=Color(0.02,.06,.1,.86); panel.position=Vector2(16,16); panel.size=Vector2(315,112); layer.add_child(panel)
    var info=Label.new(); info.text="LOGAN  •  NIVEAU 1\nPV 100 / 100    EXP 0 / 1000"; info.position=Vector2(16,12); info.add_theme_font_size_override("font_size",18); panel.add_child(info)
    faction_label=Label.new(); faction_label.text="Faction : Sans faction"; faction_label.position=Vector2(16,74); panel.add_child(faction_label)
    quest_label=Label.new(); quest_label.text="QUÊTE PRINCIPALE\nChoisis ta voie : Pirate ou Marine"; quest_label.position=Vector2(850,24); quest_label.add_theme_font_size_override("font_size",18); layer.add_child(quest_label)
    var hint=Label.new(); hint.text="ZQSD / WASD / flèches • Approche un recruteur"; hint.position=Vector2(430,675); layer.add_child(hint)

func _choose_faction(side:String):
    if faction!="Sans faction": return
    faction=side; faction_label.text="Faction : "+side
    quest_label.text="QUÊTE TERMINÉE : Choisis ta voie\nBienvenue chez les "+side+"s !"
