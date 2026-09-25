extends CharacterBody2D

@export var speed:=260.0

func _physics_process(_delta):
    var v=Vector2.ZERO
    if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_Q) or Input.is_key_pressed(KEY_LEFT): v.x-=1
    if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT): v.x+=1
    if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_Z) or Input.is_key_pressed(KEY_UP): v.y-=1
    if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN): v.y+=1
    velocity=v.normalized()*speed
    move_and_slide()
