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

}