import { getSocket } from "./socket.js";
import { playDialogue, showDialogue, clearDialogue, registerDialogueStyle } from "./effects/dialogue.js";
import { resolveTokens, tokensInsideTile, waitUntilInside } from "./effects/tokens.js";
import { resolveTileId } from "./effects/tiles.js";

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export function registerAPI() {
    console.log("API.JS LOADED");

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

    Cutscene.starfield = {};

    Cutscene.starfield.start = function(options = {}) {

        getSocket().executeForEveryone(
            "starfieldStart",
            options
        );

    };

    Cutscene.starfield.stop = function() {

        getSocket().executeForEveryone(
            "starfieldStop"
        );

    };

    Cutscene.dialogue = {

        play: playDialogue,

        show: showDialogue,

        clear: clearDialogue,

        registerStyle: registerDialogueStyle

    };

    // Older macros keep working, now drawn by the dialogue system

    Cutscene.starDialogue = {};

    Cutscene.starDialogue.show = function({

        side = "left",

        starType = "ancient",

        title = "",

        text = "",

        duration = 5000

    } = {}) {

        return playDialogue([{
            style: "star",
            star: starType,
            portraitSide: side,
            speaker: title,
            text,
            speed: 0,
            advance: "timed",
            hold: duration
        }]);

    };

    Cutscene.tokens = {};

    Cutscene.tokens.move = function(options={}){

        getSocket().executeForEveryone(
            "moveTokens",
            options
        );

    };

    Cutscene.tokens.lock = function() {

        getSocket().executeForEveryone(
            "tokensLock",
            true
        );

    };

    Cutscene.tokens.unlock = function() {

        getSocket().executeForEveryone(
            "tokensLock",
            false
        );

    };

    // tokens: list of token ids or names. Leave out for all player tokens.

    Cutscene.tokens.fadeOut = async function({

        tokens = null,

        duration = 1500

    } = {}) {

        const ids = resolveTokens(tokens).map(token => token.id);

        await getSocket().executeForEveryone(
            "tokensFade",
            ids,
            1,
            0,
            duration
        );

        await wait(duration);

        await getSocket().executeAsGM(
            "tokensSetHidden",
            canvas.scene.id,
            ids,
            true
        );

    };

    Cutscene.tokens.show = async function({

        tokens = null

    } = {}) {

        const ids = resolveTokens(tokens).map(token => token.id);

        await getSocket().executeAsGM(
            "tokensSetHidden",
            canvas.scene.id,
            ids,
            false
        );

    };

    Cutscene.tokens.allInside = function(tile, tokens = null) {

        return tokensInsideTile(tile, tokens, true);

    };

    // all: true waits for every token, false for the first one

    Cutscene.tokens.waitUntilInside = function(tile, {

        all = true,

        tokens = null

    } = {}) {

        return waitUntilInside(tile, tokens, all);

    };

    Cutscene.tiles = {};

    // Give x/y for an exact spot, or dx/dy to move relative to where it is now

    Cutscene.tiles.move = async function({

        tile,

        x = null,

        y = null,

        dx = 0,

        dy = 0,

        duration = 3000

    } = {}) {

        const tileId = resolveTileId(tile);

        const tileDocument = canvas.scene?.tiles.get(tileId);

        if (!tileDocument) {

            ui.notifications.error(`Tile '${tile}' not found on this scene.`);

            return;

        }

        const targetX = x ?? tileDocument.x + dx;
        const targetY = y ?? tileDocument.y + dy;

        await getSocket().executeForEveryone(
            "tileMove",
            tileId,
            targetX,
            targetY,
            duration
        );

        await wait(duration);

        await getSocket().executeAsGM(
            "tileSetPosition",
            canvas.scene.id,
            tileId,
            targetX,
            targetY
        );

    };

    Cutscene.screen = {};

    Cutscene.screen.grey = async function(options = {}) {

        await getSocket().executeForEveryone(
            "screenGrey",
            options
        );

        await wait(options.duration ?? 2000);

    };

    Cutscene.screen.cover = async function(options = {}) {

        await getSocket().executeForEveryone(
            "screenCover",
            options
        );

        await wait(options.duration ?? 2000);

    };

    Cutscene.screen.reveal = async function(options = {}) {

        await getSocket().executeForEveryone(
            "screenReveal",
            options
        );

        await wait(options.duration ?? 2000);

    };

    Cutscene.music = {};

    Cutscene.music.play = function(options={}) {


    const executeTime =
        Date.now() + (options.delay ?? 3000);


        getSocket().executeForEveryone(
            "playMusic",
            {
                ...options,
                executeTime
            }
        );

    };

Cutscene.whiteout = {};

Cutscene.whiteout.show = function(options={}){

        getSocket().executeForEveryone(
            "whiteout",
            options
        );

    };

Cutscene.whiteout.clear=function(){

        getSocket().executeForEveryone(
            "clearWhiteout"
        );

    };

Cutscene.scene = {};

// Only the GM can switch scenes. Resolves once the new scene has loaded here.

Cutscene.scene.change = async function(options = {}) {

        const scene = game.scenes.getName(options.sceneName);

        if (!scene) {

            ui.notifications.error(`Scene '${options.sceneName}' not found.`);

            return;

        }

        if (canvas.scene?.id === scene.id)
            return;

        const loaded = new Promise(resolve => {

            const hookId = Hooks.on("canvasReady", readyCanvas => {

                if (readyCanvas.scene?.id !== scene.id)
                    return;

                Hooks.off("canvasReady", hookId);

                resolve();

            });

            // Never hang the macro if something goes wrong
            setTimeout(() => {

                Hooks.off("canvasReady", hookId);

                resolve();

            }, 20000);

        });

        await getSocket().executeAsGM(
            "changeScene",
            options
        );

        await loaded;

    };

    Cutscene.button = {};

    Cutscene.button.show = function({

    users = "all",

    ...options

} = {}) {

    const socket = getSocket();

    if (users === "all") {

        socket.executeForEveryone(
            "showButton",
            options
        );

    } else {

        socket.executeForUsers(
            "showButton",
            users,
            options
        );

    }

};

Cutscene.button.remove = function(users = "all") {

    const socket = getSocket();

    if (users === "all") {

        socket.executeForEveryone(
            "removeButton"
        );

    } else {

        socket.executeForUsers(
            "removeButton",
            users
        );

    }

};

Cutscene.ripple = {};

Cutscene.ripple.play = function(color="#66ddff"){

    getSocket().executeForEveryone(
        "ripple",
        color
    );

};

Cutscene.lights = {};

Cutscene.lights.hide = function(lightIds = []) {

    getSocket().executeAsGM(
        "lightsHide",
        lightIds
    );

};

Cutscene.lights.show = function(lightIds = [], duration = 3000) {

    getSocket().executeAsGM(
        "lightsShow",
        lightIds,
        duration
    );

};

Cutscene.lights.toggle = function(lightIds = []) {

    getSocket().executeAsGM(
        "lightsToggle",
        lightIds
    );

};

Cutscene.mode = {};

// Options: x, y, scale (leave x/y out to fit the scene), lockCamera (default true)

Cutscene.mode.start = function(options = {}) {

    getSocket().executeForEveryone(
        "cutsceneStart",
        options
    );

};

Cutscene.mode.stop = function() {

    getSocket().executeForEveryone(
        "cutsceneStop"
    );

};

Cutscene.impact = function(options = {}) {

    getSocket().executeForEveryone(
        "impact",
        options
    );

};

    console.log("STARFIELD API CREATED", Cutscene.starfield);

}