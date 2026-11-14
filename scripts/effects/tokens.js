// Token control for cutscenes: locking movement, fading, and area checks.

let movementLocked = false;


/*  Finding Tokens  */

// No list = every player-owned token on the current scene.
// Otherwise a list of token ids or token names.

export function resolveTokens(tokens = null) {

    if (!canvas.tokens)
        return [];

    if (!tokens)
        return canvas.tokens.placeables.filter(
            token => token.actor?.hasPlayerOwner
        );

    return tokens
        .map(ref =>
            canvas.tokens.get(ref.split(".").pop()) ??
            canvas.tokens.placeables.find(token => token.name === ref)
        )
        .filter(token => token);

}


function isInsideTile(token, tile) {

    const { x, y } = token.center;

    return (
        x >= tile.x &&
        x <= tile.x + tile.width &&
        y >= tile.y &&
        y <= tile.y + tile.height
    );

}


// all = true: every token's center is inside the tile's area.
// all = false: at least one is.

export function tokensInsideTile(tileRef, tokens = null, all = true) {

    const tile = canvas.scene?.tiles.get(tileRef.split(".").pop());

    if (!tile) {

        console.warn(`Tile not found: ${tileRef}`);

        return false;

    }

    const found = resolveTokens(tokens);

    if (found.length === 0)
        return false;

    return all
        ? found.every(token => isInsideTile(token, tile))
        : found.some(token => isInsideTile(token, tile));

}


// Resolves once the tokens are inside the tile. Checks after every saved
// token move, so it never sees a position from before the move.

export function waitUntilInside(tileRef, tokens = null, all = true) {

    return new Promise(resolve => {

        const check = () => {

            if (!tokensInsideTile(tileRef, tokens, all))
                return;

            Hooks.off("updateToken", hookId);

            resolve();

        };

        const hookId = Hooks.on("updateToken", check);

        // They might already be there
        check();

    });

}



/*  Movement Lock  */

export function localLockTokens(locked = true) {

    movementLocked = locked;

}


// Runs on the client trying to move the token, so blocking it here stops the move

Hooks.on("preUpdateToken", (tokenDocument, changes) => {

    if (!movementLocked || game.user.isGM)
        return;

    if ("x" in changes || "y" in changes)
        return false;

});



/*  Fading  */

// Runs on every client so the fade is smooth, without a database write per frame

export function localFadeTokens(tokenIds = [], from = 1, to = 0, duration = 1500) {

    const tokens = tokenIds
        .map(id => canvas.tokens?.get(id))
        .filter(token => token);

    return new Promise(resolve => {

        const start = performance.now();

        function step(now) {

            const progress = Math.min((now - start) / duration, 1);

            const alpha = from + (to - from) * progress;

            for (const token of tokens) {

                token.alpha = alpha;

                if (token.mesh)
                    token.mesh.alpha = alpha * token.document.alpha;

            }

            if (progress < 1)
                requestAnimationFrame(step);
            else
                resolve();

        }

        requestAnimationFrame(step);

    });

}


// GM only

export async function localSetTokensHidden(sceneId, tokenIds = [], hidden = true) {

    const scene = game.scenes.get(sceneId);

    if (!scene)
        return;

    await scene.updateEmbeddedDocuments(
        "Token",
        tokenIds.map(_id => ({ _id, hidden }))
    );

}
