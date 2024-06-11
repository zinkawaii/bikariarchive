interface MouseFn {
    (event: MouseEvent): void;
}

export default function(el: MaybeRefOrGetter<HTMLElement>, options: {
    filter?: (event: MouseEvent) => boolean;
    onMousedown?: MouseFn;
    onMousemove?: MouseFn;
    onMouseup?: MouseFn;
} = {}) {
    const isPressed = ref(false);

    const filter = options.filter ?? ((event) => event.button === 0);

    const scope = effectScope();
    scope.run(() => {
        //鼠标按下时
        useEventListener(el, "mousedown", (event) => {
            execWithFilter(event, () => {
                options.onMousedown?.(event);
                isPressed.value = true;
            });
        });

        //鼠标移动时
        useEventListener("mousemove", Zin.throttle((event) => {
            if (isPressed.value) {
                execWithFilter(event, () => {
                    options.onMousemove?.(event);
                    isPressed.value = true;
                });
            }
        }));

        //鼠标松开时
        useEventListener("mouseup", (event) => {
            if (isPressed.value) {
                options.onMouseup?.(event);
                isPressed.value = false;
            }
        });
    });

    return {
        cleanup: () => scope.stop(),
        isPressed
    };

    function execWithFilter(event: MouseEvent, handler: () => void) {
        const state = filter(event) ?? true;
        state && handler();
    }
}