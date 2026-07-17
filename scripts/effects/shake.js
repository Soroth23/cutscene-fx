export function localShake(
    intensity = 20,
    duration = 500
) {

    const original = canvas.stage.position.clone();

    const interval = setInterval(() => {

        canvas.stage.position.set(
            original.x + (Math.random()-0.5)*intensity,
            original.y + (Math.random()-0.5)*intensity
        );

    },30);


    setTimeout(() => {

        clearInterval(interval);

        canvas.stage.position.copyFrom(original);

    },duration);

}