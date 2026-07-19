export async function localMoveTokens({

    direction="right",

    distance=1,

    duration=1000


}={}) {

    const tokens = canvas.tokens.placeables.filter(
        token => token.actor?.hasPlayerOwner
    );

    if(tokens.length === 0)
        return;

    const sceneGrid = canvas.grid.size;

    let dx = 0;
    let dy =0;

    switch(direction){

        case "up":
            dy = -distance * sceneGrid;
            break;

        case "down":
            dy = distance * sceneGrid;
            break;

        case "left":
            dx = -distance * sceneGrid;
            break;

        case "right":
            dx = distance * sceneGrid;
            break;

    }

    for(const token of tokens){

        if(!token.object)
            continue;

        const startX = token.object.x;
        const startY = token.object.y;

        const endX = startX + dx;
        const endY = startY +dy;

        await animateToken(
            token,
            startX,
            startY,
            endX,
            endY,
            duration
        );

    }

}



function animateToken(
    token,
    startX,
    startY,
    endX,
    endY,
    duration,
    sceneGrid
){

    return new Promise(resolve=>{

        const start = performance.now();

        function update(time){

            const progress =
                Math.min(
                    (time-start)/duration,
                    1
                );
            
            const eased =
                progress < .5
                ? 2*progress*progress
                : 1-Math.pow(-2*progress+2,2)/2;

            token.object.position.set(

                startX +
                (endX-startX)*eased,

                startY +
                (endY-startY)*eased

            );


            if(progress < 1){

                requestAnimationFrame(update);

            }

            else {

                token.document.update({

                    x:endX / sceneGrid,

                    y:endY / sceneGrid

                });

                resolve();

            }

        }

        requestAnimationFrame(update);

    });

}