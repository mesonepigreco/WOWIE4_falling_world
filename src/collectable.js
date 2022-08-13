import * as THREE from "three";
import { Menu } from "./menu.js";
import { Sprite } from "./sprite.js";

export class Collectable extends Sprite{
    constructor(x, y, z, radius = 3, player_bind = undefined, level_bind = undefined) {
        super(x, y, z);

        this.radius = radius;
        const geometry = new THREE.SphereGeometry(radius);
        const material = new THREE.MeshStandardMaterial({
            color : 0x2222ff, 
            transparent : true,
            emissive: 0x740909, 
            opacity : 0.8,
            roughness: 0.127,
            metalness : 0.299
        });

        this.player_bind = player_bind;
        this.height = y;
        this.level_bind = level_bind;

        this.mesh = new THREE.Mesh(geometry, material);
        this.floating_period = 1500; // in ms
        this.dynamic = false;
        this.friction = 0;
        this.ground_friction = 0;
        this.ignore_collision = true;
        this.ignore_status = true;
        this.speed = 1;
    }


    get m_vecMin() {
        let radius = this.radius;
        return new THREE.Vector3(this.position.x - radius,
            this.position.y - radius, this.position.z - radius);
    }
    get m_vecMax() {
        let radius = this.radius;
        return new THREE.Vector3(this.position.x + radius,
            this.position.y + radius, this.position.z + radius);
    }


    update(dt, collision_group) {
        //super.update(dt, collision_group);        
        super.update(dt, collision_group);
        this.position.y = this.height +  this.speed * Math.cos( (Date.now() * Math.PI * 2) / this.floating_period );
        // Check the player collection
        if (this.player_bind !== undefined) {
            if (this.player_bind.collide_box(this)) {
                // Collision with the player
                this.player_bind.sound_coin.play();
                console.log("OPEN THE MENU");
                this.level_bind.display_menu = new Menu(this.level_bind.upgrades);
                this.kill();
            }
        }
    }
}