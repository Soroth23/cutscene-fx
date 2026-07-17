import { createOverlay } from "./overlay.js";

export function localTint({

    color = "#000000",

    opacity = 0.5,

    duration = 1000

} = {}) {

    createOverlay({

        color,

        opacity,

        duration,

        fadeOut: true

    });

}