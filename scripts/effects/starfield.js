let container = null;
let stars = [];
let animation = null;

/**
 * Creates the HTML container that sits over Foundry.
 */
function createContainer() {

    if (container) return;

    container = document.createElement("div");

    Object.assign(container.style, {
        position: "fixed",
        inset: "0",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: "9000"
    });

    document.body.appendChild(container);

}

/**
 * Creates one star and returns its data.
 */
function createStar(sideWidth = 15) {

    const element = document.createElement("div");

    const size = Math.random() * 4 + 2;

    Object.assign(element.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "white",
        boxShadow: "0 0 12px white"
    });

    // Left or right side of screen
    const leftSide = Math.random() < 0.5;

    const x = leftSide
        ? Math.random() * sideWidth
        : 100 - sideWidth + Math.random() * sideWidth;

    const y = Math.random() * 100;

    element.style.left = `${x}%`;
    element.style.top = `${y}%`;

    container.appendChild(element);

    return {

        element,

        brightness: Math.random(),

        pulse: Math.random() * Math.PI * 2,

        speed: 0.002 + Math.random() * 0.003

    };

}

/**
 * Adds a new star.
 */
function addStar(sideWidth) {

    stars.push(createStar(sideWidth));

}

/**
 * Animation loop.
 */
function update(time) {

    for (const star of stars) {

        const glow =
            0.5 +
            Math.sin(time * star.speed + star.pulse) * 0.5;

        star.element.style.opacity = glow;

        star.element.style.transform =
            `scale(${0.8 + glow * 0.4})`;

    }

    animation = requestAnimationFrame(update);

}

/**
 * Starts the starfield.
 */
export function localStartStarfield({

    count = 100,

    sideWidth = 15

} = {}) {

    // Prevent duplicates
    localStopStarfield();

    createContainer();

    stars = [];

    for (let i = 0; i < count; i++) {

        addStar(sideWidth);

    }

    animation = requestAnimationFrame(update);

}

/**
 * Stops the starfield.
 */
export function localStopStarfield() {

    if (animation) {

        cancelAnimationFrame(animation);

        animation = null;

    }

    for (const star of stars) {

        star.element.remove();

    }

    stars = [];

    if (container) {

        container.remove();

        container = null;

    }

}