import * as THREE from "three";

export const INVISIBLE = 0;
export const ACTIVE = 1;
export const APPEARING = 2;
export const DESTROYING = 3;
export const PERMANENT = 4;

export class Sprite {
    constructor(x, y, z, width = 1, height = 1, depth = 1, color = 0xcccccc) {
        // Construct the platform
        // x, y and z are integer
        this.position = new THREE.Vector3(x, y, z);
        this.dimension = new THREE.Vector3(width, height, depth);

        this.status = ACTIVE;

        this.geometry = new THREE.BoxGeometry(this.dimension.x, 
            this.dimension.y, this.dimension.z);
        this.material = new THREE.MeshStandardMaterial({color : color, transparent : true, opacity: 1.0});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;

        this.dynamic = false;

        this.grounded = false;
        this.velocity = new THREE.Vector3(0,0,0);
        this.acceleration = new THREE.Vector3(0,-9.81, 0);

        this.friction = 23;
        this.ground_friction = 6;

        const listener = new THREE.AudioListener();
        const audioLoader = new THREE.AudioLoader();
        this.sound_hit_ground = new THREE.Audio(listener);
        audioLoader.load("assets/audio/hit_ground.wav", function(buffer) {
            this.sound_hit_ground.setBuffer(buffer);
            this.sound_hit_ground.setVolume(0.5);
        }.bind(this));
    }

    add_scene(scene) {
        scene.add(this.mesh);
    }
    get m_vecMin() {
        return new THREE.Vector3(this.position.x - .5 * this.dimension.x,
            this.position.y - .5 * this.dimension.y, this.position.z - .5*this.dimension.z);
    }
    get m_vecMax() {
        return new THREE.Vector3(this.position.x + .5 * this.dimension.x,
            this.position.y + .5 * this.dimension.y, this.position.z + .5*this.dimension.z);
    }

    collide_box(other_box) {
        let tBox1 = this;
        let tBox2 = other_box;
        return(tBox1.m_vecMax.x > tBox2.m_vecMin.x &&
            tBox1.m_vecMin.x < tBox2.m_vecMax.x &&
            tBox1.m_vecMax.y > tBox2.m_vecMin.y &&
            tBox1.m_vecMin.y < tBox2.m_vecMax.y &&
            tBox1.m_vecMax.z > tBox2.m_vecMin.z &&
            tBox1.m_vecMin.z < tBox2.m_vecMax.z);
    }

    set_gravity() {
        // Setup the gravity
        this.acceleration.y = -9.81;
        this.acceleration.x = 0;
        this.acceleration.z = 0;
    }

    update_status() {
        //console.log("my status:", this.status);
        //this.mesh.material.opacity = 0.7;
        if (this.status === ACTIVE || this.status == PERMANENT) {
            this.mesh.material.opacity = 1.0;
            this.mesh.material.color = new THREE.Color(0xdddddd);
        } else if (this.status === INVISIBLE) {
            this.mesh.material.opacity = 0.0;
        } else if (this.status === APPEARING) {
            this.mesh.material.opacity = 0.3;
            this.mesh.material.color = new THREE.Color(0x22FF22);
        }else if (this.status === DESTROYING) {
            this.mesh.material.opacity = 1;
            this.mesh.material.color = new THREE.Color(0xFF0A0A0A);
        }
    }

    update(dt, collision_group) {
        if (!this.dynamic) this.update_status();

        // Implement physics
        if (this.dynamic) {

            // Apply friction
            this.acceleration.x -= this.velocity.x * this.friction * dt;
            this.acceleration.y -= this.velocity.y * this.friction * dt;
            this.acceleration.z -= this.velocity.z * this.friction * dt;

            // Apply ground friction
            if (this.grounded) {
                const dir_vect = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z);
                dir_vect.normalize();
                this.acceleration.x -= dir_vect.x * this.ground_friction * dt;
                this.acceleration.z -= dir_vect.z * this.ground_friction * dt;
            }


            this.velocity.x += this.acceleration.x * dt;
            this.velocity.y += this.acceleration.y * dt;
            this.velocity.z += this.acceleration.z * dt;

            // Update on x
            let old_x = this.position.x;
            this.position.x += dt * this.velocity.x;

            // Check collision and eventually reset
            for (let i = 0; i < collision_group.length; ++i) {
                let box = collision_group.at(i);
                if (box.status !== ACTIVE && box.status !== DESTROYING && box.status !== PERMANENT) continue;
                if (this.collide_box(box)) {
                    this.position.x = old_x;
                    this.velocity.x = 0;
                    break;
                }
            }

            // Update on y
            let old_y = this.position.y;
            this.position.y += dt * this.velocity.y;

            // Check collision and eventually reset
            let y_collision = false;
            if (this.velocity.y > 0) this.grounded = false;
            for (let i = 0; i < collision_group.length; ++i) {
                let box = collision_group.at(i);
                if (box.status !== ACTIVE && box.status !== DESTROYING && box.status !== PERMANENT) {
                    continue;
                }
                if (this.collide_box(box)) {
                    if (this.velocity.y < 0)  {
                        y_collision = true;
                        if (!this.grounded) {
                            this.grounded = true;
                            this.sound_hit_ground.play();
                        }
                    }

                    this.position.y = old_y;
                    this.velocity.y = 0;
                    break;
                }
            }
            if (!y_collision) this.grounded = false;
            

            // Update on z
            let old_z = this.position.z;
            this.position.z += dt * this.velocity.z;

            // Check collision and eventually reset
            for (let i = 0; i < collision_group.length; ++i) {
                let box = collision_group.at(i);
                if (box.status !== ACTIVE && box.status !== DESTROYING && box.status !== PERMANENT) continue;
                if (this.collide_box(box)) {
                    this.position.z = old_z;
                    this.velocity.z = 0;
                    break;
                }
            }
        }

        // Update the position on the screen
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;

    }

}


export class Group {
    constructor(list = []) {
        this.elements = list;
    }

    update(dt, collision_group) {
        for (let i = 0; i < this.length; ++i) {
            this.at(i).update(dt, collision_group);
        }
    }

    at(i) {
        return this.elements[i];
    }

    push(element) {
        this.elements.push(element);
    }

    get length() {
        return this.elements.length;
    }
}