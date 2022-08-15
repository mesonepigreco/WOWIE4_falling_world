import { Keyboard } from "./keyboard.js";
import * as THREE from "three";

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
            this.hover();
            console.log("Focus on:", upgrade_list[this.focus]);
        }
        function press_s() {
            this.focus += 1;
            if (this.focus >= upgrade_list.length) this.focus = 0;
            this.hover();
            console.log("Focus on:", upgrade_list[this.focus]);
        }
        function press_return() {
            // Avoid pressing return too soon
            if (Date.now() - this.trigger > this.cooldown) {
                this.final_status = this.focus;
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

        // Apply the hover
        this.hover();
    }

    hover() {
        for (let i = 0; i < this.li_elements.length; ++i) {
            if (i == this.focus)
                this.li_elements[i].style.transform = "scale(1.1)";
            else
                this.li_elements[i].style.transform = "scale(1.0)";
        }
    }

    update() {
        // TODO: sometimes play the voices
    }

    destroy() {
        console.log("Destroy fired.");
        document.body.removeChild(this.divContainer);
    }
}


export class TextAudio {
    constructor(text_tracks, audio_files, audio_duration) {
        this.text_tracks = text_tracks;
        this.audio_duration = audio_duration;

        // Load the audio files
        this.has_audio = [];
        this.tracks = [];
        this.audio_ended = true;

        this.divContainer = null;
        this.trigger = -1000;
        this.cooldown = 1000;

        this.sequence = [];

        const listener = new THREE.AudioListener();
        const loader = new THREE.AudioLoader();
        for (let i = 0; i < audio_files.length; ++i) {
            if (audio_files[i] !== null) {
                const track = new THREE.Audio(listener);
                loader.load(audio_files[i], function(buffer) {
                    track.setBuffer(buffer);
                });
                this.tracks.push(track);
                this.has_audio.push(true);
            } else {
                this.tracks.push(null);
                this.has_audio.push(false);

            }
        }
    }

    display_text(text, cooldown = 2000) {
        this.divContainer = document.createElement("div");
        this.divContainer.className = "text";
        let paragraph = document.createElement("p");
        paragraph.className = "textEntry";
        this.trigger = Date.now();
        this.cooldown = cooldown;
        this.audio_ended = true;
    
        const textEntry = document.createTextNode(text);
        paragraph.appendChild(textEntry);
        this.divContainer.appendChild(paragraph);
        document.body.appendChild(this.divContainer);
    }

    talk(index) {
        this.display_text(this.text_tracks[index]);
        console.log("TALKING:", this.text_tracks[index], "AUDIO:", this.has_audio[index]);
        if (this.has_audio[index]) {
            console.log("PLAYING");
            this.tracks[index].play()
            /*this.audio_ended = false;
            this.tracks[index].onEnded( function() {
                console.log("Audio:", index, "ended!");
                this.audio_ended = true;
                this.trigger = Date.now();
                this.cooldown = 1000;
            }.bind(this));*/
            this.cooldown = this.audio_duration[index] * 1000 + 500;
        }
    }

    add_talk(index) {
        this.sequence.push(index);
    }

    long_talk(indices) {
        for (let i = 0; i < indices.length; ++i)
            this.add_talk(indices[i]);
    }

    clear() {
        document.body.removeChild(this.divContainer);
        this.divContainer = null;
    }

    update() {
        let time = Date.now();
        if (this.divContainer !== null) {
            // Check if the text needs to be cancelled
            //console.log("Check destroy: timer:", time - this.trigger, "cooldown:", this.cooldown, "audio:", this.audio_ended)
            if ((time - this.trigger > this.cooldown) && this.audio_ended) {
                // Destroy the text
                this.clear();

                // Remove the element from the sequence
                //console.log("Destroy!");
            }
        } else {
            // Update the sequence
            if (this.sequence.length > 0) {
                this.talk(this.sequence[0]);
                this.sequence.shift();
            }
        }
    }
}