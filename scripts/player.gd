extends CharacterBody3D

@export var speed:=8.0

func _physics_process(delta):
    var v=Vector2.ZERO
    if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_Q) or Input.is_key_pressed(KEY_LEFT): v.x-=1
    if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT): v.x+=1
    if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_Z) or Input.is_key_pressed(KEY_UP): v.y-=1
    if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN): v.y+=1
    v=v.normalized(); velocity.x=v.x*speed; velocity.z=v.y*speed
    if v.length()>0: rotation.y=atan2(v.x,v.y)
    if not is_on_floor(): velocity.y-=20.0*delta
    else: velocity.y=0
    move_and_slide()
