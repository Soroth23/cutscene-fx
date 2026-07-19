export function localPlayMusic({

    playlist,

    track,

    executeTime

} = {}) {


    const wait =
        executeTime - Date.now();


    setTimeout(() => {


        const sound =
            game.playlists
            .getName(playlist)
            ?.sounds
            .getName(track);



        if(!sound){

            console.warn(
                "Music not found",
                playlist,
                track
            );

            return;

        }



        sound.update({

            playing:true

        });


    }, Math.max(wait, 0));


}