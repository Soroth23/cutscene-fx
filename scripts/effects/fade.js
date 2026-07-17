import { createOverlay } from "./overlay.js";

export function localFade({

    color = "#000000",

    duration = 1000

} = {}) {

    createOverlay({

        color,

        opacity: 1,

        duration

    });

}