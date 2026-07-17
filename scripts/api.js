import { getSocket } from "./socket.js";

export function registerAPI() {

    globalThis.Cutscene = {};

    globalThis.Cutscene.shake = function(
        intensity = 20,
        duration = 500
    ) {

        getSocket().executeForEveryone(
            "shake",
            intensity,
            duration
        );

    };

    Cutscene.flash = function({

        color = "#ffffff",

        duration = 150

    } = {}) {

            getSocket().executeForEveryone(
                "flash",
            {
                color,
                duration
            }
        );

    };

    Cutscene.fade = function({

        color = "#000000",

        duration = 150

    } = {}) {

        getSocket().executeForEveryone(
            "fade",
            {
                color,
                duration
            }
        );

    };
}