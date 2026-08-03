// 复制文本
export function copyText(text: string, message: string) {
  const toastStore = useToastStore();

  navigator.clipboard.writeText(text);
  toastStore.success("[copy]:text", message);
}

// 复制图像
export function copyImage(link: string, message: string) {
  const toastStore = useToastStore();

  const imgEl = new Image();
  imgEl.crossOrigin = "anonymous";
  imgEl.src = link;
  imgEl.addEventListener("load", () => {
    const { naturalWidth, naturalHeight } = imgEl;

    const canvas = document.createElement("canvas");
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0, naturalWidth, naturalHeight);

    canvas.toBlob((blob) => {
      if (!blob) {
        toastStore.error("[copy]:image", "图像复制失败");
        return;
      }

      const data = [new ClipboardItem({
        [blob.type]: blob,
      })];

      navigator.clipboard.write(data);
      toastStore.success("[copy]:image", message);
    });
  });
}
