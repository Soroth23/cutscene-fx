// Smoothly moves a tile. Every client animates it locally,
// then the GM saves the final position once.

export function resolveTileId(tileRef = "") {

    // Accepts a plain id or a full UUID like "Scene.abc.Tile.xyz"
    return tileRef.split(".").pop();

}


export function localMoveTile(tileId, x, y, duration = 3000) {

    const tile = canvas.tiles?.get(tileId);

    if (!tile)
        return;

    const dx = x - tile.document.x;
    const dy = y - tile.document.y;

    const objectStart = tile.position.clone();
    const meshStart = tile.mesh?.position.clone();

    return new Promise(resolve => {

        const start = performance.now();

        function step(now) {

            const progress = Math.min((now - start) / duration, 1);

            // Smoothstep easing
            const eased = progress * progress * (3 - 2 * progress);

            tile.position.set(
                objectStart.x + dx * eased,
                objectStart.y + dy * eased
            );

            if (tile.mesh)
                tile.mesh.position.set(
                    meshStart.x + dx * eased,
                    meshStart.y + dy * eased
                );

            if (progress < 1)
                requestAnimationFrame(step);
            else
                resolve();

        }

        requestAnimationFrame(step);

    });

}


// GM only

export async function localSetTilePosition(sceneId, tileId, x, y) {

    const tile = game.scenes.get(sceneId)?.tiles.get(tileId);

    if (!tile)
        return;

    await tile.update({ x, y });

}
