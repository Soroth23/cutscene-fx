let impactContainer = null;


/*  Impact Effects  */

function playImpactEffect(effect, container, options = {}) {

    switch (effect) {

        case "ripple":
            playRippleEffect(container, options);
            break;

        case "blood":
            playBloodEffect(container, options);
            break;

        case "flash":
            playFlashEffect(container, options);
            break;

        case "none":
        case null:
        case undefined:
            break;

        default:
            console.warn(`Unknown impact effect: ${effect}`);
            break;

    }

}


/*  Ripple Effect  */

function playRippleEffect(container, options = {}) {

    const color =
        options.effectColor ?? "#66ddff";

    const rippleCount =
        options.rippleCount ?? 3;

    const duration =
        options.duration ?? 1200;

    for (let i = 0; i < rippleCount; i++) {

        const ripple = document.createElement("div");

    ripple.style.position = "absolute";

    ripple.style.left = "50%";
    ripple.style.top = "50%";

    ripple.style.width = "50px";
    ripple.style.height = "50px";

    ripple.style.transform = "translate(-50%, -50%)";

    ripple.style.border = `4px solid ${color}`;

    ripple.style.borderRadius = "50%";

    ripple.style.boxSizing = "border-box";

    ripple.style.opacity = "0.9";

    ripple.style.pointerEvents = "none";

        container.appendChild(ripple);

        const delay = (i * duration) / rippleCount;

        ripple.animate(
            [
                { 
                    width: "50px",
                    height: "50px",
                    opacity: 0.9
                },
                { 
                    width: "1000px",
                    height: "1000px",
                    opacity: 0
                }
            ],
            {
                duration: duration,
                delay: delay,
                easing: "ease-out",
                fill: "forwards"
            }
        );

    }

}


/*  Blood Effect  */

function playBloodEffect(container, options = {}) {

    const count =
        options.bloodCount ?? 8;

    const duration =
        options.duration ?? 1000;

    for (let i = 0; i < count; i++) {

        const splatter =
            document.createElement("div");

        splatter.style.position = "absolute";

        splatter.style.left = "50%";
        splatter.style.top = "50%";

        splatter.style.width =
            `${10 + Math.random() * 30}px`;

        splatter.style.height =
            `${10 + Math.random() * 30}px`;

        splatter.style.background =
            "#8b0000";

        splatter.style.borderRadius =
            "50%";

        splatter.style.pointerEvents =
            "none";

        const angle =
            Math.random() * 2 * Math.PI;

        const distance =
            150 + Math.random() * 500;

        container.appendChild(splatter);

        splatter.animate(
            [
                {
                    transform: 
                        "translate(-50%, -50%) scale(0.2)",

                    opacity: 0
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1)",

                    opacity: 1,

                    offset: 0.2
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${Math.cos(angle) * distance}px),
                            calc(-50% + ${Math.sin(angle) * distance}px)
                        ) 
                        scale(0.7)`,

                    opacity: 0
                }
            ],
            {
                duration: duration,
                easing: "ease-out",
                fill: "forwards"
            }
        );
    
    }

}


/*  Flash Effect  */

function playFlashEffect(container, options = {}) {

    const color =
        options.flashColor ?? "#ffffff";

    const duration =
        options.flashDuration ?? 250;

    const flash = 
        document.createElement("div");

    flash.style.position = "absolute";

    flash.style.left = "0";
    flash.style.top = "0";

    flash.style.width = "100%";
    flash.style.height = "100%";

    flash.style.background = color;

    flash.style.pointerEvents = "none";

    container.appendChild(flash);

    flash.animate(
        [
            {
                opacity: 0
            },

            {
                opacity: 0.8
            },

            {
                opacity: 0
            }
        ],
        {
            duration: duration,
            easing: "ease-out",
            fill: "forwards"
        }
    );

}


/*  Main Impact Function  */

export async function localImpact({

    image,

    duration = 3000,

    size = 600,

    sound = null,

    effect = null,

    effectColor = "#66ddff",

    rippleCount = 3,

    bloodCount = 8

} = {}) {

    if (!canvas.ready)
        return;

    if (!image)
        return;


    //  Hide Foundry UI

    document.body.classList.add(
        "cutscene-fx-active"
    );


    try {

        // Create Container

        impactContainer =
            document.createElement("div");

        impactContainer.id =
            "cutscene-fx-impact";

        Object.assign(
            impactContainer.style,
            {

                position: "fixed",

                left: "0",
                top: "0",

                width: "100vw",
                height: "100vh",

                display: "flex",

                justifyContent:
                    "center",

                zIndex:
                    "10000",

                pointerEvents:
                    "none"


            }
        );


        // Create Image

        const img =
            document.createElement("img");

        img.src = image;

        Object.assign(
            img.style,
            {

                width:
                    `${size}px`,

                height:
                    "auto",

                maxWidth:
                    "100vw",

                maxHeight:
                    "100vh",

                objectFit:
                    "contain",

                pointerEvents:
                    "none",

                position:
                    "relative",

                zIndex:
                    "2"


            }
        );


        // Add Image

        impactContainer.appendChild(img);

        document.body.appendChild(
            impactContainer
        );


        // Play Sound

        if (sound) {

            AudioHelper.play(
                {

                    src: sound,

                    volume: 0.8,

                    autoplay: true,

                    loop: false

                },

                true
            );

        }


        // Play Effect

        playImpactEffect(
            effect,
            impactContainer,
            {

                effectColor,

                rippleCount,

                bloodCount

            }
        );


        // Wait

        await new Promise(
            resolve =>
                selfTimeout(
                    resolve,
                    duration
                )
        );

    }

    finally {


        // Remove Impact

        if (impactContainer) {

            impactContainer.remove();

            impactContainer = null;

        }



        // Restore Foundry UI

        document.body.classList.remove(
            "cutscene-fx-active"
        );
        
    }

}