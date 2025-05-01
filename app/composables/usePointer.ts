interface PointerFn<R = unknown> {
    (event: PointerEvent): R | void;
}

export interface UsePointerOptions {
    filter?: (event: PointerEvent) => boolean;
    onPointerdown?: PointerFn;
    onPointermove?: PointerFn;
    onPointerup?: PointerFn<boolean>;
}

export default function(
    el: MaybeRefOrGetter<HTMLElement | null | undefined>,
    options: UsePointerOptions,
) {
    const {
        filter = () => true,
    } = options;

    const isHolding = ref(false);

    //鼠标按下时
    useEventListener(el, "pointerdown", (event) => {
        if (!filter(event)) {
            return;
        }
        options.onPointerdown?.(event);
        isHolding.value = true;
    });

    //鼠标移动时
    useEventListener("pointermove", (event) => {
        if (!isHolding.value || !filter(event)) {
            return;
        }
        options.onPointermove?.(event);
    });

    //鼠标松开时
    useEventListener("pointerup", (event) => {
        if (!isHolding.value) {
            return;
        }
        if (options.onPointerup?.(event) !== false) {
            isHolding.value = false;
        }
    });

    return {
        isHolding,
    };
}
