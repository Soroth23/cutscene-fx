import { hideUI, restoreUI } from "../ui.js";

let cameraLocked = false;

let lockedX = 0;
let lockedY = 0;
let lockedScale = 1;



/*  Camera Lock  */


function enforceCameraLock(canvasInstance, position) {

    // GM is never locked
    if (game.user.isGM)
        return;

    if (!cameraLocked)
        return;

    const distance =
        Math.abs(position.x - lockedX) +
        Math.abs(position.y - lockedY);

    const scaleDifference =
        Math.abs(position.scale - lockedScale);

    if (
        distance > 0.01 ||
        scaleDifference > 0.001
    ) {

        canvasInstance.pan({
            x: lockedX,
            y: lockedY,
            scale: lockedScale
        });

    }

}



/*  Start Cutscene Mode  */


// Centers the scene and zooms so the whole thing fits on screen

function fitSceneView() {

    const rect = canvas.dimensions.sceneRect;

    return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        scale: Math.min(
            window.innerWidth / rect.width,
            window.innerHeight / rect.height
        )
    };

}


export async function localStartCutsceneMode({

    // Leave x and y out to fit the whole scene on screen
    x = null,

    y = null,

    scale = null,

    lockCamera = true

} = {}) {

    //GMs are not affected by cutscene mode
    if (game.user.isGM)
        return;

    // This player may still be loading a scene the GM just switched to
    if (!canvas.ready)
        await new Promise(resolve => Hooks.once("canvasReady", resolve));

    const view =
        x === null || y === null
            ? fitSceneView()
            : { x, y, scale: scale ?? 1 };

    cameraLocked = lockCamera;

    lockedX = view.x;
    lockedY = view.y;
    lockedScale = view.scale;

    hideUI("cutsceneMode");

    // Move player camera to the locked position
    canvas.pan({
        x: lockedX,
        y: lockedY,
        scale: lockedScale
    });

}



/*  Stop Cutscene Mode  */


export async function localStopCutsceneMode() {

    // Gms are not affected by cutscene mode
    if (game.user.isGM)
        return;

    cameraLocked = false;

    restoreUI("cutsceneMode");

}



/*  Camera Enforce  */


Hooks.on("canvasPan", (canvasInstance, position) => {

    enforceCameraLock(canvasInstance, position);

});