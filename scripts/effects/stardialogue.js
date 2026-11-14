// Glowing star "portraits" used by the dialogue system's star style.
// See dialogue.js for the dialogue box itself.

const STAR_TYPES = {

    new: {

    size:120,

    background:
    `
    radial-gradient(
        circle,
        white 0%,
        #99ffff 40%,
        cyan 60%,
        transparent 80%
    )
    `,

    glow:
    `
    0 0 30px white,
    0 0 70px cyan,
    0 0 140px cyan,
    0 0 220px white
    `,

    animation:"newStarPulse 2s infinite ease-in-out"

},

    ancient: {

        size: 150,

        background:
        `
        radial-gradient(
            circle,
            white 0%,
            #fff4b0 25%,
            gold 50%,
            transparent 75%
        )
        `,

        glow:
        `
        0 0 30px white,
        0 0 80px gold,
        0 0 160px gold,
        0 0 250px white
        `,

        animation:"ancientStarPulse 3s infinite ease-in-out"

    },


    void: {

        size:150,

        background:
        `
        radial-gradient(
            circle,
            black 0%,
            #120020 40%,
            purple 65%,
            transparent 80%
        )
        `,

        glow:
        `
        0 0 40px purple,
        0 0 100px purple,
        0 0 200px black
        `,

        animation:"voidStarPulse 2s infinite"

    },


    fallen: {

        size:120,

        background:
        `
        radial-gradient(
            circle,
            white 0%,
            orange 40%,
            red 70%,
            transparent 80%
        )
        `,

        glow:
        `
        0 0 30px orange,
        0 0 80px red,
        0 0 150px orange
        `,

        animation:"fallenStarFlicker .5s infinite"

    },


    divine: {

        size:200,

        background:
        `
        radial-gradient(
            circle,
            white 0%,
            white 30%,
            #ffffaa 60%,
            transparent 80%
        )
        `,

        glow:
        `
        0 0 50px white,
        0 0 150px white,
        0 0 300px white
        `,

        animation:"divineStarPulse 1.5s infinite"

    }

};

function addStarAnimation(){

    if(document.getElementById("cutscene-star-style"))
        return;

    const style=document.createElement("style");

    style.id="cutscene-star-style";

    style.innerHTML=`

    @keyframes ancientStarPulse {

    0% {
        transform:scale(.9);
        filter:brightness(1);
    }

    50% {
        transform:scale(1.15);
        filter:brightness(2);
    }

    100% {
        transform:scale(.9);
        filter:brightness(1);
    }

}


@keyframes voidStarPulse {

    0% {
        transform:scale(1) rotate(0deg);
    }

    50% {
        transform:scale(1.1) rotate(10deg);
    }

    100% {
        transform:scale(1) rotate(0deg);
    }

}


@keyframes fallenStarFlicker {

    0% {
        opacity:.8;
    }

    50% {
        opacity:.4;
    }

    100% {
        opacity:1;
    }

}


@keyframes divineStarPulse {

    0% {
        transform:scale(.8);
        filter:brightness(1);
    }

    50% {
        transform:scale(1.3);
        filter:brightness(4);
    }

    100% {
        transform:scale(.8);
        filter:brightness(1);
    }

}

@keyframes newStarPulse {

        0% {

            transform:scale(0.8);

            filter:
            brightness(1);

        }


        50% {

            transform:scale(1.15);

            filter:
            brightness(2);

        }


        100% {

            transform:scale(0.8);

            filter:
            brightness(1);

        }

    }

    `;

    document.head.appendChild(style);

}


export function createStarOrb(starType="ancient", size=null){

    addStarAnimation();

    const star = document.createElement("div");
    const style = STAR_TYPES[starType] ?? STAR_TYPES.ancient;

    const finalSize = size ?? style.size;

    Object.assign(star.style,{

        width:`${finalSize}px`,

        height:`${finalSize}px`,

        flexShrink:"0",

        borderRadius:"50%",

        background:style.background,

        boxShadow:style.glow,

        animation:style.animation

    });

    return star;

}
