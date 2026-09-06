export async function localHideLights(lightIds = []) {

    if (!canvas.scene)
        return;

    for (const id of lightIds) {

        const lightId = id.split(".").pop();

        const light = canvas.scene.lights.get(lightId);

        if (!light)
            continue;

        await light.update({
            hidden: true
        });

    }

}


export async function localShowLights(lightIds = [], duration = 5000) {

    if (!canvas.scene)
        return;

    for (const id of lightIds) {

        const lightId = id.split(".").pop();

        const light = canvas.scene.lights.get(lightId);

        if (!light)
            continue;

        // Remember the light's original settings
        const targetAlpha = light.config.alpha;
        const targetLuminosity = light.config.luminosity;

        console.log(
            "FADING LIGHT:",
            lightId,
            "Alpha:",
            targetAlpha,
            "Luminosity:",
            targetLuminosity
        );

        // Turn the light on, but make BOTH components invisible
        await light.update({
            hidden: false,
            "config.alpha": 0,
            "config.luminosity": 0
        });

        const startTime = performance.now();

        function fadeIn() {

            const elapsed = performance.now() - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            // Smoothstep easing
            const eased =
                progress * progress * (3 - 2 * progress);

            // Fade BOTH the color intensity and luminosity
            light.update({
                "config.alpha": targetAlpha * eased,
                "config.luminosity": targetLuminosity * eased
            });

            if (progress < 1) {

                requestAnimationFrame(fadeIn);

            } else {

                // Guarantee exact final values
                light.update({
                    "config.alpha": targetAlpha,
                    "config.luminosity": targetLuminosity
                });

                console.log(
                    "LIGHT FADE COMPLETE:",
                    lightId
                );

            }

        }

        requestAnimationFrame(fadeIn);

    }

}


export async function localToggleLights(lightIds = []) {

    if (!canvas.scene)
        return;

    for (const id of lightIds) {

        const lightId = id.split(".").pop();

        const light = canvas.scene.lights.get(lightId);

        if (!light)
            continue;

        await light.update({
            hidden: !light.hidden
        });

    }

}