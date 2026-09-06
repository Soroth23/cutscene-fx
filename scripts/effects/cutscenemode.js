let cutsceneModeActive = false;

let lockedX = 0;
let lockedY = 0;
let lockedScale = 1;



/*  UI  */


function hideUI() {

    document.body.classList.add("cutscene-fx-active");

}


function restoreUI() {

    document.body.classList.remove("cutscene-fx-active");

}



/*  Camera Lock  */


function enforceCameraLock(canvasInstance, position) {

    // GM is never locked
    if (game.user.isGM)
        return;

    if (!cutsceneModeActive)
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


export async function localStartCutsceneMode({

    x = 0,

    y = 0,

    scale = 1

} = {}) {

    if (!canvas.ready)
        return;

    //GMs are not affected by cutscene mode
    if (game.user.isGM)
        return;

    cutsceneModeActive = true;

    lockedX = x;
    lockedY = y;
    lockedScale = scale;

    hideUI();

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

    cutsceneModeActive = false;

    restoreUI();

}



/*  Camera Enforce  */


Hooks.on("canvasPan", (canvasInstance, position) => {

    enforceCameraLock(canvasInstance, position);

});