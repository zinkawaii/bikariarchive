export const useImageViewerStore = defineStore("image-viewer", {
    state: () => ({
        state: false,
        target: null
    }),
    actions: {
        open(target: HTMLImageElement) {
            this.state = true;
            this.target = target;
        },
        close() {
            this.state = false;
        }
    }
});