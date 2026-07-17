console.log("CUTSCENE FX LOADED");

import { registerAPI } from "./api.js";
import { registerSocket } from "./socket.js";

Hooks.once("ready", () => {

    registerSocket();

    registerAPI();

    console.log("Cutscene FX Ready");

});