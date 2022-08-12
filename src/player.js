import { Keyboard } from "./keyboard.js";
import { Sprite } from "./sprite.js";
import * as THREE from "three";

export class Player extends Sprite {
    constructor(x, y, z) {
        super(x, y, z, 1, 1, 1, 0xff0000);
        this.dynamic = true;

        this.key_control = new Keyboard();


        this.direction = new THREE.Vector3(1, 0, 0);
        this.rot_speed = 1.5;
        this.speed = 76.2;
        this.jump_value = 12;


        function jump() {
            console.log("JUMPING:", this.grounded);
            if (this.grounded)
                this.velocity.y += this.jump_value;
        }

        this.key_control.firefunctions_down.push({
            key : " ",
            func : jump.bind(this)
        });
    }

    update_controls(dt) {
        if (this.key_control.keys["a"]) {
            this.mesh.rotation.y += this.rot_speed * dt;
        } 
        else if (this.key_control.keys["d"]) {
            this.mesh.rotation.y -= this.rot_speed * dt;
        }

        this.update_direction();

        if (this.key_control.keys["w"]) {
            this.acceleration.x += dt *this.speed * this.direction.x;
            this.acceleration.y += dt *this.speed * this.direction.y;
            this.acceleration.z += dt *this.speed * this.direction.z;
        }
        else if (this.key_control.keys["s"]) {
            this.acceleration.x -= dt *this.speed * this.direction.x;
            this.acceleration.y -= dt *this.speed * this.direction.y;
            this.acceleration.z -= dt *this.speed * this.direction.z;
        }
    }

    update_direction() {
        this.direction.x = Math.cos(-this.mesh.rotation.y);
        this.direction.z = Math.sin(-this.mesh.rotation.y);
    }

    update(dt, collision_group) {
        this.set_gravity();
        this.update_controls(dt);
        super.update(dt, collision_group);
    }
}