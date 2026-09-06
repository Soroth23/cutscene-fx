import { localShake } from "./effects/shake.js";
import { localFlash } from "./effects/flash.js";
import { localFade } from "./effects/fade.js";
import { localStartStarfield, localStopStarfield } from "./effects/starfield.js";
import { localStarDialogue } from "./effects/stardialogue.js";
import { localMoveTokens } from "./effects/tokenmove.js";
import { localPlayMusic } from "./effects/music.js";
import { localClearWhiteout, localWhiteout } from "./effects/whiteout.js";
import { localChangeScene } from "./effects/mapchange.js";
import { localShowButton, localRemoveButton, localRipple } from "./effects/button.js";
import { localHideLights, localShowLights, localToggleLights } from "./effects/lights.js";
import { localStartCutsceneMode, localStopCutsceneMode } from "./effects/cutscenemode.js";

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

    socket.register(
        "starfieldStart",
        localStartStarfield
    );

    socket.register(
        "starfieldStop",
        localStopStarfield
    );

    socket.register(
        "starDialogue",
        localStarDialogue
    );

    socket.register(
        "moveTokens",
        localMoveTokens
    );

    socket.register(
        "playMusic",
        localPlayMusic
    );

    socket.register(
        "whiteout",
        localWhiteout
    );

    socket.register(
        "clearWhiteout",
        localClearWhiteout
    );

    socket.register(
        "changeScene",
        localChangeScene
    );

    socket.register(
        "showButton",
        localShowButton
    );

    socket.register(
       "removeButton",
       localRemoveButton
    );

    socket.register(
       "ripple",
        localRipple       
    );

    socket.register(
        "lightsHide",
        localHideLights
    );

    socket.register(
        "lightsShow",
        localShowLights
    );

    socket.register(
        "lightsToggle",
        localToggleLights
    );

    socket.register(
        "cutsceneStart",
        localStartCutsceneMode
    );

    socket.register(
        "cutsceneStop",
        localStopCutsceneMode
    );

}

export function getSocket() {

    return socket;

}