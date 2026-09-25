extends Node3D

var player: CharacterBody3D
var camera: Camera3D
var faction := "Sans faction"
var quest_label: Label
var faction_label: Label

func _ready():
    _build_world()
    _build_player()
    _build_ui()

func mat(color: Color) -> StandardMaterial3D:
    var m=StandardMaterial3D.new(); m.albedo_color=color; m.roughness=.8; return m

func box(pos:Vector3,size:Vector3,color:Color,name:String="Prop"):
    var body=StaticBody3D.new(); body.name=name; body.position=pos
    var mesh=MeshInstance3D.new(); var b=BoxMesh.new(); b.size=size; mesh.mesh=b; mesh.material_override=mat(color); body.add_child(mesh)
    var cs=CollisionShape3D.new(); var shape=BoxShape3D.new(); shape.size=size; cs.shape=shape; body.add_child(cs); add_child(body)

func _build_world():
    var env=WorldEnvironment.new(); var e=Environment.new(); e.background_mode=Environment.BG_COLOR; e.background_color=Color("63cde3"); e.ambient_light_source=Environment.AMBIENT_SOURCE_COLOR; e.ambient_light_color=Color("fff0d0"); e.ambient_light_energy=1.1; env.environment=e; add_child(env)
    var sun=DirectionalLight3D.new(); sun.rotation_degrees=Vector3(-55,-35,0); sun.shadow_enabled=true; sun.light_energy=1.3; add_child(sun)
    box(Vector3(0,-1,0),Vector3(105,2,82),Color("54a86b"),"Island")
    box(Vector3(0,-1.7,49),Vector3(150,1,28),Color("21a7c7"),"Sea")
    box(Vector3(0,-.15,34),Vector3(90,.3,10),Color("e8c77c"),"Beach")
    for z in [-15.0,0.0,15.0]:
        for x in [-30.0,-15.0,0.0,15.0,30.0]:
            if abs(x)<8 and abs(z)<8: continue
            box(Vector3(x,1.5,z),Vector3(8,3,7),Color("d9a45d"),"House")
            box(Vector3(x,3.5,z),Vector3(9,1,8),Color("b54f3b"),"Roof")
    box(Vector3(-18,2,25),Vector3(13,4,10),Color("7d402e"),"PirateTavern")
    box(Vector3(20,2,24),Vector3(14,4,11),Color("e9ecef"),"MarineOffice")
    for x in range(-35,36,7): box(Vector3(x,.25,41),Vector3(5,.5,13),Color("7a5133"),"Dock")
    for i in range(24):
        var a=float(i)*TAU/24.0; var p=Vector3(cos(a)*45,2,sin(a)*30)
        box(p,Vector3(1.2,4,1.2),Color("6b4423"),"Palm")
        box(p+Vector3(0,3,0),Vector3(4,2,4),Color("237a42"),"Leaves")
    # Place du village, routes et détails du port
    box(Vector3(0,-.05,5),Vector3(18,.2,18),Color("c9b07c"),"VillageSquare")
    box(Vector3(0,.05,18),Vector3(5,.15,28),Color("bda678"),"MainRoad")
    for x in [-38.0,-27.0,-8.0,8.0,27.0,38.0]:
        box(Vector3(x,.2,28),Vector3(1.2,.4,1.2),Color("6b4423"),"Barrel")
    for x in [-31.0,-21.0,-11.0,11.0,21.0,31.0]:
        box(Vector3(x,.55,36),Vector3(.35,1.1,.35),Color("56351f"),"DockPost")
    # Marché côtier
    for x in [-12.0,-6.0,6.0,12.0]:
        box(Vector3(x,1,10),Vector3(4,2,3),Color("d48b4c"),"MarketStall")
        box(Vector3(x,2.3,10),Vector3(4.6,.35,3.5),Color("e7c45b"),"Awning")
    # Falaises et zone sauvage au nord
    for x in range(-45,46,10):
        box(Vector3(x,2,-35),Vector3(9,5,7),Color("6f7565"),"Cliff")
    for z in [-28.0,-22.0]:
        for x in [-36.0,-24.0,-12.0,12.0,24.0,36.0]:
            box(Vector3(x,2,z),Vector3(1.1,4,1.1),Color("6b4423"),"ForestTree")
            box(Vector3(x,4,z),Vector3(4.5,3,4.5),Color("1d6b3b"),"ForestCanopy")
    # Navire amarré au port (silhouette 3D originale)
    box(Vector3(-26,1.2,48),Vector3(15,2.5,5),Color("59351f"),"PirateShipHull")
    box(Vector3(-26,5,48),Vector3(.6,8,.6),Color("4b2e1d"),"Mast")
    box(Vector3(-23,5.5,48),Vector3(5,.25,5),Color("f0e2bd"),"Sail")
    # Petite crique et rochers
    for x in [-43.0,-39.0,39.0,43.0]:
        box(Vector3(x,.6,33),Vector3(3,1.5,3),Color("77786f"),"BeachRock")
    _npc(Vector3(-18,1,20),"Capitaine pirate","Pirate")
    _npc(Vector3(20,1,18),"Officier de la Marine","Marine")

func _npc(pos:Vector3,title:String,side:String):
    var a=Area3D.new(); a.position=pos; a.set_meta("side",side); a.set_meta("title",title)
    var mesh=MeshInstance3D.new(); var c=CapsuleMesh.new(); c.height=2.2; c.radius=.55; mesh.mesh=c; mesh.material_override=mat(Color("9b3f32") if side=="Pirate" else Color("e7edf5")); a.add_child(mesh)
    var cs=CollisionShape3D.new(); var s=SphereShape3D.new(); s.radius=2.4; cs.shape=s; a.add_child(cs); add_child(a)
    a.body_entered.connect(func(body): if body==player: _choose_faction(side))

func _build_player():
    player=CharacterBody3D.new(); player.name="Logan"; player.position=Vector3(0,1,27); player.set_script(load("res://scripts/player.gd"))
    var mesh=MeshInstance3D.new(); var c=CapsuleMesh.new(); c.height=2.0; c.radius=.55; mesh.mesh=c; mesh.material_override=mat(Color("274c77")); player.add_child(mesh)
    var cs=CollisionShape3D.new(); var s=CapsuleShape3D.new(); s.height=2.0; s.radius=.55; cs.shape=s; player.add_child(cs); add_child(player)
    camera=Camera3D.new(); camera.position=Vector3(0,22,14); camera.rotation_degrees=Vector3(-60,0,0); camera.current=true; player.add_child(camera)

func _build_ui():
    var layer=CanvasLayer.new(); add_child(layer)
    var panel=ColorRect.new(); panel.color=Color(0.03,.08,.12,.82); panel.position=Vector2(18,18); panel.size=Vector2(310,110); layer.add_child(panel)
    var name=Label.new(); name.text="LOGAN   •   NIVEAU 1\nPV 100 / 100   EXP 0 / 1000"; name.position=Vector2(18,12); name.add_theme_font_size_override("font_size",18); panel.add_child(name)
    faction_label=Label.new(); faction_label.text="Faction : Sans faction"; faction_label.position=Vector2(18,70); panel.add_child(faction_label)
    quest_label=Label.new(); quest_label.text="QUÊTE PRINCIPALE\nChoisis ta voie : Pirate ou Marine"; quest_label.position=Vector2(850,24); quest_label.add_theme_font_size_override("font_size",18); layer.add_child(quest_label)
    var hint=Label.new(); hint.text="Déplacement : ZQSD / WASD / flèches • Approche un recruteur"; hint.position=Vector2(360,670); layer.add_child(hint)

func _choose_faction(side:String):
    if faction!="Sans faction": return
    faction=side; faction_label.text="Faction : "+side; quest_label.text="QUÊTE TERMINÉE : Choisis ta voie\nBienvenue chez les "+side+"s !"
