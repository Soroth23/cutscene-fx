import { getSocket } from "../socket.js";
import { createStarOrb } from "./stardialogue.js";


/*  Styles  */

// A style is just a set of default line options.
// Any of these can be overridden per line, or for a whole play() call.

const BASE_STYLE = {

    speaker: "",
    text: "",

    portrait: null,
    star: null,
    portraitSide: "left",
    portraitPlacement: "inside",
    portraitSize: 120,
    portraitRendering: "auto",

    speed: 30,
    blip: null,
    blipVolume: 0.5,

    advance: "gm",
    hold: null,

    position: "bottom",
    offset: "5%",
    width: "70%",
    minHeight: "160px",
    padding: "24px",

    background: "rgba(0, 0, 20, 0.85)",
    border: "2px solid white",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)",

    font: "Signika, sans-serif",
    fontUrl: null,
    fontSize: "24px",
    textColor: "white",
    speakerColor: "#ffd966",
    textAlign: "left",

    indicator: true

};

const STYLES = {

    default: {},

    retro: {

        background: "black",
        border: "4px solid white",
        borderRadius: "0",
        boxShadow: "none",

        font: "'VT323', monospace",
        fontUrl: "https://fonts.googleapis.com/css2?family=VT323&display=swap",
        fontSize: "34px",
        speakerColor: "white",

        width: "60%",
        padding: "20px 28px",

        portraitRendering: "pixelated",

        speed: 40

    },

    star: {

        star: "ancient",
        portraitPlacement: "floating",
        portraitSize: null,

        offset: "15%",
        width: "60%",
        padding: "30px",

        borderRadius: "20px",
        boxShadow: "0 0 40px white",

        fontSize: "28px",
        speakerColor: "white",
        textAlign: "center"

    }

};


export function registerDialogueStyle(name, style = {}) {

    STYLES[name] = style;

}


function resolveLine(options) {

    const style = STYLES[options.style ?? "default"];

    if (!style)
        console.warn(`Unknown dialogue style: ${options.style}`);

    return {
        ...BASE_STYLE,
        ...style,
        ...options
    };

}



/*  Shared Helpers  */

// What this client is currently showing
let view = null;

// The sequence being run. Only exists on the client that called play().
let run = null;

const loadedFonts = new Set();

let lastBlip = 0;


function addDialogueStyles() {

    if (document.getElementById("cutscene-dialogue-style"))
        return;

    const style = document.createElement("style");

    style.id = "cutscene-dialogue-style";

    style.innerHTML = `
        @keyframes cutsceneDialogueBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;

    document.head.appendChild(style);

}


function loadFont(url) {

    if (!url || loadedFonts.has(url))
        return;

    loadedFonts.add(url);

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = url;

    document.head.appendChild(link);

}


function canAdvance(advance) {

    switch (advance) {

        case "any":
            return true;

        case "gm":
            return game.user.isGM;

        default:
            return false;

    }

}



/*  Display (runs on every client)  */


function createPortrait(line) {

    // An image always wins, so the star style can still use a custom portrait

    if (!line.portrait)
        return line.star ? createStarOrb(line.star, line.portraitSize) : null;

    const img = document.createElement("img");

    img.src = line.portrait;

    Object.assign(img.style, {

        width: `${line.portraitSize}px`,
        height: `${line.portraitSize}px`,

        objectFit: "contain",
        flexShrink: "0",

        border: "none",
        imageRendering: line.portraitRendering

    });

    return img;

}


function placeBox(box, line) {

    switch (line.position) {

        case "top":
            box.style.top = line.offset;
            break;

        case "center":
            box.style.top = "50%";
            box.style.transform = "translate(-50%, -50%)";
            break;

        default:
            box.style.bottom = line.offset;
            break;

    }

}


export function localDialogueLine(line) {

    addDialogueStyles();

    loadFont(line.fontUrl);


    // Reuse the open box so lines replace each other without flickering

    if (view) {

        clearTimeout(view.timer);

        view.container.replaceChildren();

    } else {

        const container = document.createElement("div");

        Object.assign(container.style, {

            position: "fixed",
            inset: "0",

            pointerEvents: "none",

            zIndex: "10000",

            opacity: "0",
            transition: "opacity 0.3s ease"

        });

        document.body.appendChild(container);

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                container.style.opacity = "1";

            });

        });

        view = { container };

    }


    const clickable = canAdvance(line.advance);


    // Box

    const box = document.createElement("div");

    Object.assign(box.style, {

        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",

        width: line.width,
        maxWidth: "90vw",
        minHeight: line.minHeight,
        padding: line.padding,
        boxSizing: "border-box",

        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexDirection: line.portraitSide === "right" ? "row-reverse" : "row",

        background: line.background,
        border: line.border,
        borderRadius: line.borderRadius,
        boxShadow: line.boxShadow,

        color: line.textColor,
        fontFamily: line.font,
        fontSize: line.fontSize,
        textAlign: line.textAlign,

        pointerEvents: clickable ? "auto" : "none",
        cursor: clickable ? "pointer" : "default"

    });

    placeBox(box, line);


    // Portrait

    const portrait = createPortrait(line);

    if (portrait) {

        if (line.portraitPlacement === "floating") {

            portrait.style.position = "absolute";
            portrait.style.top = "40%";

            if (line.portraitSide === "right")
                portrait.style.right = "10%";
            else
                portrait.style.left = "10%";

            view.container.appendChild(portrait);

        } else {

            box.appendChild(portrait);

        }

    }


    // Speaker and text

    const column = document.createElement("div");

    column.style.flex = "1";
    column.style.minWidth = "0";

    if (line.speaker) {

        const speaker = document.createElement("div");

        Object.assign(speaker.style, {
            color: line.speakerColor,
            fontWeight: "bold",
            fontSize: "1.1em",
            marginBottom: "8px"
        });

        speaker.textContent = line.speaker;

        column.appendChild(speaker);

    }

    // The untyped part is laid out but invisible, so words
    // don't jump to the next line halfway through typing

    const textElement = document.createElement("div");

    textElement.style.whiteSpace = "pre-wrap";

    const shown = document.createElement("span");
    const hidden = document.createElement("span");

    hidden.style.visibility = "hidden";

    textElement.append(shown, hidden);

    column.appendChild(textElement);

    box.appendChild(column);


    // "Click to continue" arrow

    const indicator = document.createElement("div");

    indicator.textContent = "▼";

    Object.assign(indicator.style, {
        position: "absolute",
        right: "14px",
        bottom: "8px",
        fontSize: "0.7em",
        animation: "cutsceneDialogueBlink 1s steps(1) infinite",
        display: "none"
    });

    box.appendChild(indicator);


    if (clickable)
        box.addEventListener("click", sendInput);

    view.container.appendChild(box);


    // Start typing

    let resolveTyped;

    Object.assign(view, {

        line,

        chars: Array.from(line.text ?? ""),
        index: 0,

        shown,
        hidden,
        indicator,

        typing: true,
        timer: null,

        typed: new Promise(resolve => resolveTyped = resolve)

    });

    view.resolveTyped = resolveTyped;

    renderText();

    if (line.speed > 0 && view.chars.length > 0)
        view.timer = setTimeout(typeNext, line.speed);
    else
        finishTyping();

}


function renderText() {

    view.shown.textContent = view.chars.slice(0, view.index).join("");
    view.hidden.textContent = view.chars.slice(view.index).join("");

}


function typeNext() {

    if (!view?.typing)
        return;

    const char = view.chars[view.index];

    view.index++;

    renderText();

    if (char.trim())
        playBlip(view.line);

    if (view.index >= view.chars.length)
        finishTyping();
    else
        view.timer = setTimeout(typeNext, view.line.speed);

}


function finishTyping() {

    if (!view?.typing)
        return;

    clearTimeout(view.timer);

    view.index = view.chars.length;

    renderText();

    view.typing = false;

    if (view.line.indicator && canAdvance(view.line.advance))
        view.indicator.style.display = "block";

    view.resolveTyped();

}


function playBlip(line) {

    if (!line.blip)
        return;

    // Avoid stacking sounds at very fast typing speeds

    const now = performance.now();

    if (now - lastBlip < 50)
        return;

    lastBlip = now;

    foundry.audio.AudioHelper.play(
        {
            src: line.blip,
            volume: line.blipVolume,
            autoplay: true,
            loop: false
        },
        false
    );

}


function sendInput() {

    if (!view)
        return;

    const { lineId, runnerId } = view.line;

    if (runnerId === game.user.id)
        localDialogueInput(lineId);
    else
        getSocket().executeAsUser("dialogueInput", runnerId, lineId);

}


export function localDialogueFinishTyping(lineId) {

    if (view?.line.lineId === lineId)
        finishTyping();

}


export function localDialogueClear() {

    if (!view)
        return;

    clearTimeout(view.timer);

    view.resolveTyped?.();

    const container = view.container;

    view = null;

    container.style.opacity = "0";

    setTimeout(() => container.remove(), 300);

}



/*  Sequencing (runs on the client that called play)  */


// A click from someone allowed to advance. The first click
// finishes the typing for everyone, the next one advances.

export function localDialogueInput(lineId) {

    if (!run || run.lineId !== lineId)
        return;

    if (view?.line.lineId === lineId && view.typing) {

        getSocket().executeForOthers("dialogueFinishTyping", lineId);

        localDialogueFinishTyping(lineId);

        return;

    }

    run.next?.();

}


function waitForAdvance(thisRun, line, typed) {

    return new Promise(resolve => {

        thisRun.next = resolve;

        const hold =
            line.hold ?? (line.advance === "timed" ? 2000 : null);

        // hold works in every mode: in "gm" or "any" it auto-advances
        // unless someone clicks first

        if (hold !== null)
            typed.then(() => setTimeout(resolve, hold));

    });

}


function cancelRun() {

    if (!run)
        return;

    run.cancelled = true;

    run.next?.();

    run = null;

}


export async function playDialogue(lines = [], options = {}) {

    if (!Array.isArray(lines))
        lines = [lines];

    const { clear = true, ...defaults } = options;

    cancelRun();

    const thisRun = {
        cancelled: false,
        lineId: null,
        next: null
    };

    run = thisRun;

    for (const entry of lines) {

        if (thisRun.cancelled)
            return;

        const raw =
            typeof entry === "string" ? { text: entry } : entry;

        // Functions can't be sent over the socket, so the effect stays here

        const { effect, ...lineOptions } = {
            ...defaults,
            ...raw
        };

        const line = resolveLine(lineOptions);

        line.lineId = foundry.utils.randomID();
        line.runnerId = game.user.id;

        thisRun.lineId = line.lineId;

        getSocket().executeForOthers("dialogueLine", line);

        localDialogueLine(line);

        const typed = view.typed;

        if (typeof effect === "function")
            Promise.resolve().then(effect).catch(console.error);

        await waitForAdvance(thisRun, line, typed);

    }

    if (run !== thisRun)
        return;

    run = null;

    if (clear)
        clearDialogue();

}


export function showDialogue(line = {}, options = {}) {

    return playDialogue([line], options);

}


export function clearDialogue() {

    cancelRun();

    getSocket().executeForOthers("dialogueClear");

    localDialogueClear();

}
