import { localShake } from "./effects/shake.js";
import { localFlash } from "./effects/flash.js";
import { localFade } from "./effects/fade.js";

let socket;

export function registerSocket() {

    socket = socketlib.registerModule("cutscene-fx");

    socket.register(
        "shake", 
        localShake
    );

    socket.register(
        "flash", 
        localFlash
    );

    socket.register(
        "fade", 
        localFade
    );

}

export function getSocket() {

    return socket;

}