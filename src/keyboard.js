export class Keyboard {
    constructor() {
        this.keys = {
        };

        // Fire specific function when a key is pressed
        this.firefunctions_down = [];
        this.firefunctions_up = [];

        let self = this;
        document.addEventListener("keydown", (event) => {
            self.keys[event.key] = true;

            for (let i = 0; i < this.firefunctions_down.length; ++i) {
                if (event.key === this.firefunctions_down[i].key) 
                    this.firefunctions_down[i].func();
            }
            if (event.target == document.body) 
                event.preventDefault();
        });
        document.addEventListener("keyup", (event) => {
            self.keys[event.key] = false;

            for (let i = 0; i < this.firefunctions_up.length; ++i) {
                if (event.key === this.firefunctions_up[i].key) 
                    this.firefunctions_up[i].func();
            }
        });
    }
}