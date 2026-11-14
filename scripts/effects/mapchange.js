export async function localChangeScene({

    sceneName

}={}){

    const scene=game.scenes.getName(sceneName);

    if(!scene){

        ui.notifications.error(
            `Scene '${sceneName}' not found.`
        );

        return;

    }

    await scene.activate();

    // Activating pulls players over; make sure the GM's view follows too
    if (canvas.scene?.id !== scene.id)
        await scene.view();

}