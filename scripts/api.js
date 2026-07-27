import { getSocket } from "./socket.js";

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

    Cutscene.starDialogue = {};

    Cutscene.starDialogue.show = function(options={}){

        getSocket().executeForEveryone(
            "starDialogue",
            options
        );

    };

    Cutscene.tokens = {};

    Cutscene.tokens.move = function(options={}){

        getSocket().executeForEveryone(
            "moveTokens",
            options
        );

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

Cutscene.scene.change=function(options={}){

        getSocket().executeForEveryone(
            "changeScene",
            options
        );

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

    console.log("STARFIELD API CREATED", Cutscene.starfield);

}