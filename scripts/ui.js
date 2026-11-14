/*  Shared UI Hiding  */

// Each effect that hides the Foundry UI adds a reason here.
// The UI only comes back once every reason has been released,
// so effects can overlap without restoring the UI early.

const hideReasons = new Set();


export function hideUI(reason) {

    hideReasons.add(reason);

    document.body.classList.add("cutscene-fx-active");

}


export function restoreUI(reason) {

    hideReasons.delete(reason);

    if (hideReasons.size === 0)
        document.body.classList.remove("cutscene-fx-active");

}
