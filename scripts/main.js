import { registerAPI } from "./api.js";
import { registerSocket } from "./socket.js";

console.log("CUTSCENE FX LOADED");

Hooks.once("ready", () => {

    console.log("READY START");

    try {

        registerSocket();

        console.log("SOCKET OK");

        registerAPI();

        console.log("API OK");

    }

    catch(error){

        console.error("CUTSCENE FX FAILED", error);

    }

});