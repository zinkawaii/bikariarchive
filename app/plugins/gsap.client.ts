interface GsapEffect<T = gsap.TweenVars> {
    name: string;
    effect: (targets: gsap.TweenTarget, config: T) => gsap.core.Tween;
    defaults?: T;
    extendTimeline?: boolean;
}

export default defineNuxtPlugin(() => {
    const gsap = useGsap();

    const effects: GsapEffect[] = [
        {
            name: "rotate",
            effect(targets, config) {
                return gsap.to(targets, config);
            },
            defaults: {
                rotate: 360,
                duration: 1.5,
                ease: "linear",
                repeat: -1
            }
        }
    ];

    for (const effect of effects) {
        gsap.registerEffect(effect);
    }
});