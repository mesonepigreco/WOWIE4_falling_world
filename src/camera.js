import * as THREE from "three";


export class PlayerCamera extends THREE.PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far);

        this.bind_player = null;
        this.velocity = new THREE.Vector3(0,0,0);
        this.speed = 2;
        this.distance = 8;
        this.ahead = 2;
        this.heigth = 5;
        this.fixed_height = true;
    }

    get target() {
        const res = new THREE.Vector3(this.position.x, this.position.y, this.position.z);

        if (this.bind_player !== null) {
            res.copy(this.bind_player.position);
            if (this.fixed_height) {
                res.y = 0;
            }
            res.x -= this.bind_player.direction.x * this.distance;
            res.y += this.heigth;
            res.z -= this.bind_player.direction.z * this.distance;
        }
        return res;
    }

    get lookPos() {
        const position = new THREE.Vector3();
        position.copy(this.bind_player.position);
        position.y = Math.max(position.y, this.ahead);
        return position;
    }

    update_velocity() {
        const target = this.target;
        this.velocity.x = this.target.x - this.position.x;
        this.velocity.y = this.target.y - this.position.y;
        this.velocity.z = this.target.z - this.position.z;

    }

    update(dt) {
        this.update_velocity();
        this.position.x += this.velocity.x * this.speed * dt;
        this.position.y += this.velocity.y * this.speed * dt;
        this.position.z += this.velocity.z * this.speed * dt;
        
        if (this.bind_player !== null)
            this.lookAt(this.lookPos);

        //console.log("TARGET POS:", this.bind_player.position);
        //console.log("CAMERA POS:", this.position);

        // Update the projection matrix
        this.updateProjectionMatrix();
    }
}