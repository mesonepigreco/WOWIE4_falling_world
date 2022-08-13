import { Keyboard } from "./keyboard.js";

/*
 * The class of the ingame menu for selecting the upgrades
 */

export class Menu {
    constructor(upgrade_list) {
        this.upgrade_list = upgrade_list;

        this.divContainer = document.createElement("div");
        this.divContainer.className = "menu";
        this.trigger = Date.now();
        this.cooldown = 2000;


        
        // Add a ul li for the menu selection
        this.ulContainer = document.createElement("ul");
        this.li_elements = [];
        for (let i = 0; i < upgrade_list.length; ++i) {
            const li = document.createElement("li");
            li.className = "menuEntry";
            const text = document.createTextNode(upgrade_list[i]);
            li.appendChild(text);
            this.li_elements.push(li);
            this.ulContainer.appendChild(li);
        }

        this.divContainer.appendChild(this.ulContainer);
        document.body.appendChild(this.divContainer);


        // Prepare the input
        this.final_status = -1;
        this.focus = 0;
        this.keyboard = new Keyboard();

        function press_w() {
            this.focus -= 1;
            if (this.focus < 0) this.focus = upgrade_list.length - 1;
        }
        function press_s() {
            this.focus += 1;
            if (this.focus >= upgrade_list.length) this.focus = 0;
        }
        function press_return() {
            // Avoid pressing return too soon
            if (Date.now() - this.trigger > this.cooldown) {
                this.final_status = this.focus;
                this.destroy();
            }
        }

        this.keyboard.firefunctions_up = [
            {
                key : "w",
                func : press_w.bind(this)
            }, 
            {
                key : "s",
                func : press_s.bind(this)
            },
            {
                key : " ",
                func : press_return.bind(this)
            }
        ];
    }

    hover() {
        const mouseOver = new Event("mouseover");
        this.li_elements[this.focus].dispatchEvent(mouseOver);
    }

    update() {
        this.hover();

        // TODO: sometimes play the voices
    }

    destroy() {
        document.body.removeChild(this.divContainer);
    }

}