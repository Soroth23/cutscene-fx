import { getSocket } from "../socket.js";


let container = null;

function removeButton() {

    if (container) {
        container.remove();
        container = null;
    }

}

export function localShowButton({

    title = "Continue",

    text = "",

    color = "#2b6cff",

    textColor = "white",

    timeout = 30000

} = {}) {

    removeButton();

    container = document.createElement("div");

    Object.assign(container.style,{

        position:"fixed",

        inset:"0",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        pointerEvents:"none",

        zIndex:"10000",

        opacity:"1",

        transition:"opacity 2s ease"

    });

    const button=document.createElement("button");

    Object.assign(button.style,{

    width:"650px",
    height:"180px",

    border:"none",
    borderRadius:"18px",

    background:color,
    color:textColor,

    fontSize:"24px",

    fontFamily:"serif",
    fontWeight:"bold",
    letterSpacing:"1px",

    backdropFilter:"blur(6px)",
    outline:"none",

    cursor:"pointer",

    pointerEvents:"auto",

    boxShadow:`
        0 0 20px ${color},
        0 0 40px ${color},
        0 0 80px ${color}
    `,

    transition:
        "transform 2s ease, " +
        "filter 2s ease, " +
        "opacity 2s ease, " +
        "box-shadow 2s ease"

});

    button.innerHTML=`
        <h2 style="margin:0">${title}</h2>
        <p style="margin-top:12px">${text}</p>
    `;

    button.onmouseenter=()=>{

        button.style.transform="scale(1.05)";
        button.style.filter="brightness(1.2)";

    };

    button.onmouseleave=()=>{

        button.style.transform="";
        button.style.filter="";

    };

    button.onclick = async () => {

        if(!container)
            return;

        clearTimeout(timeoutId)

        button.disabled = true;

        await getSocket().executeForEveryone(
            "ripple",
            color
        );

        removeButton();

    };

    container.appendChild(button);

    document.body.appendChild(container);

    const timeoutId = setTimeout(async () => {

        if(!container)
            return;

        button.disabled = true;

        button.style.pointerEvents = "none";
        button.style.boxShadow = "none";

        container.style.opacity = "0";

        setTimeout(() => {

            removeButton();

        }, 2000);

    }, timeout);

}

export function localRipple(color="#66ddff"){

    return new Promise(resolve=>{

        const ripple=document.createElement("div");

        Object.assign(ripple.style,{

            position:"fixed",

            left:"50%",
            top:"50%",

            width:"20px",
            height:"20px",

            transform:"translate(-50%,-50%)",

            border:`8px solid ${color}`,

            borderRadius:"50%",

            background:"rgba(102,221,255,.08)",

            boxShadow:`
                0 0 30px ${color},
                0 0 100px ${color},
                0 0 250px ${color}
            `,

            pointerEvents:"none",

            opacity:"1",

            zIndex:"11000",

            transition:
                "transform 2s ease, " +
                "filter 2s ease, " +
                "opacity 2s ease, " +
                "box-shadow 2s ease"

        });

        document.body.appendChild(ripple);

            requestAnimationFrame(() => {

                requestAnimationFrame(()=>{

                    ripple.style.transform =
                        "translate(-50%, -50%) scale(150)";

                    ripple.style.opacity = "0";

            });

        });

        setTimeout(()=>{

            ripple.remove();
            resolve();

        }, 2000);

    });

}

export function localRemoveButton() {

    removeButton();

}