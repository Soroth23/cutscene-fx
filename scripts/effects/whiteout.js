let whiteScreen = null;
let textBox = null;

function ensureScreen() {

    if (whiteScreen) return;

    whiteScreen = document.createElement("div");

    Object.assign(whiteScreen.style, {

        position: "fixed",
        inset: "0",

        background: "white",

        opacity: "0",

        transition: "opacity 2s ease",

        zIndex: "99998",

        pointerEvents: "none"

    });

    document.body.appendChild(whiteScreen);

}


export function localWhiteout({

    text = "",

    fadeTime = 3000,

    holdTime = 4000

}={}){

    ensureScreen();

    requestAnimationFrame(()=>{

        whiteScreen.style.opacity="1";

    });

    setTimeout(()=>{

        showText(text);

    },fadeTime);

}


function showText(text){

    if(textBox)
        textBox.remove();

    textBox=document.createElement("div");

    Object.assign(textBox.style,{

        position:"fixed",

        left:"50%",

        top:"50%",

        transform:"translate(-50%,-50%)",

        color:"black",

        fontSize:"42px",

        textShadow:"0 0 30px white",

        zIndex:"99999"

    });

    textBox.textContent=text;

    document.body.appendChild(textBox);

}



export function localClearWhiteout(){

    whiteScreen?.remove();

    textBox?.remove();

    whiteScreen=null;

    textBox=null;

}