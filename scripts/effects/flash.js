import { createOverlay } from "./overlay.js";

export function localFlash({

    color = "#ffffff",

    duration = 150

} = {}) {

    createOverlay({

        color,

        opacity: 1,

        duration

    });

}