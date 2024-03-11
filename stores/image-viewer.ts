export const useImageViewerStore = defineStore("image-viewer", {
    state: () => ({
        isOpened: false,
        target: null
    }),
    actions: {
        open(target: HTMLImageElement) {
            this.isOpened = true;
            this.target = target;
        },
        close() {
            this.isOpened = false;
        }
    }
});