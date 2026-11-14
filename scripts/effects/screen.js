// Screen transitions that hold until revealed.
// The cover is a page element, so it stays up while Foundry swaps scenes underneath.

let cover = null;

let canvasLoading = false;

Hooks.on("canvasTearDown", () => canvasLoading = true);
Hooks.on("canvasReady", () => canvasLoading = false);


function getBoard() {

    return canvas.app?.view ?? document.getElementById("board");

}


/*  Grey  */

// Drains the color from the map. Only the map, not overlays like dialogue.

export function localScreenGrey({

    amount = 1,

    duration = 2000

} = {}) {

    const board = getBoard();

    if (!board)
        return;

    board.style.transition = `filter ${duration}ms ease`;
    board.style.filter = `grayscale(${amount})`;

}


/*  Cover  */

export function localScreenCover({

    color = "#ffffff",

    duration = 2000

} = {}) {

    if (!cover) {

        cover = document.createElement("div");

        Object.assign(cover.style, {

            position: "fixed",
            inset: "0",

            background: color,
            opacity: "0",

            // Blocks clicks on the map while covered
            pointerEvents: "auto",

            zIndex: "9999"

        });

        document.body.appendChild(cover);

        // Force the browser to register opacity 0 before fading in
        cover.getBoundingClientRect();

    }

    cover.style.transition =
        `opacity ${duration}ms ease, background-color ${duration}ms ease`;

    cover.style.backgroundColor = color;
    cover.style.opacity = "1";

}


/*  Reveal  */

export async function localScreenReveal({

    duration = 2000

} = {}) {

    // Don't reveal a half-loaded scene

    if (!canvas.ready || canvasLoading)
        await new Promise(resolve => Hooks.once("canvasReady", resolve));

    const board = getBoard();

    if (cover) {

        // The map is hidden behind the cover, so its color can come back instantly

        if (board) {
            board.style.transition = "";
            board.style.filter = "";
        }

        const oldCover = cover;

        cover = null;

        oldCover.style.transition = `opacity ${duration}ms ease`;
        oldCover.style.opacity = "0";

        setTimeout(() => oldCover.remove(), duration);

    } else if (board) {

        board.style.transition = `filter ${duration}ms ease`;
        board.style.filter = "";

    }

}
