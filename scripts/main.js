import { registerAPI } from "./api.js";
import { registerSocket } from "./socket.js";

console.log("CUTSCENE FX LOADED");
console.log("MAIN.JS LOADED");

Hooks.once("ready", () => {

    console.log("MAIN.JS LOADED");

    registerSocket();

    registerAPI();

    console.log("Cutscene FX Ready");

});