interface PointerFn {
    (event: PointerEvent): void;
}

export interface UseHoldOptions {
    filter?: (event: PointerEvent) => boolean;
    onPointerdown?: PointerFn;
    onPointermove?: PointerFn;
    onPointerup?: PointerFn;
}

export default function(el: MaybeRefOrGetter<HTMLElement>, options: UseHoldOptions) {
    const {
        filter = () => true
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
    useEventListener("pointermove", Zin.throttle((event) => {
        if (!isHolding.value || !filter(event)) {
            return;
        }
        options.onPointermove?.(event);
        isHolding.value = true;
    }));

    //鼠标松开时
    useEventListener("pointerup", (event) => {
        if (!isHolding.value) {
            return;
        }
        options.onPointerup?.(event);
        isHolding.value = false;
    });

    return {
        isHolding
    };
}