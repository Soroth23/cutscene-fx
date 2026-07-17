export function createOverlay({

    color = "#ffffff",

    opacity = 1,

    duration = 1000,

    fadeIn = 0,

    fadeOut = true,

    zIndex = 9999

} = {}) {

    // Create the HTML element for the overlay

    const overlay = document.createElement("div");

    // Basic styling for the overlay

    Object.assign(overlay.style, {

        position: "fixed",

        top: 0,

        left: 0,

        width: "100vw",

        height: "100vh",

        pointerEvents: "none",

        backgroundColor: color,

        opacity: opacity,

        zIndex: zIndex,

        transition: `opacity ${duration}ms ease-in-out`

    });

    // Add it to the Foundry UI layer

    document.body.appendChild(overlay);

    // Fade in

    if (fadeIn > 0) {

        overlay.style.opacity = 0;

        requestAnimationFrame(() => {

            overlay.style.transition = 
                `opacity ${fadeIn}ms ease-in-out`;

            overlay.style.opacity = opacity;

        });

    }


    // Remove after duration

    setTimeout(() => {

        if (fadeOut) {

            overlay.style.transition = 
                `opacity ${duration}ms ease-in-out`;

            overlay.style.opacity = 0;

            setTimeout(() => {

                overlay.remove();

            }, duration);

        } else {

            overlay.remove();

        }

    }, duration);

    return overlay;

    } 