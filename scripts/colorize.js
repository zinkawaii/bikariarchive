console.log("================== Light ==================");
getCuttenColors("gray", [142, 148, 160], [232, 236, 244]);
console.log("================== Dark ==================");
getCuttenColors("gray", [142, 148, 160], [44, 52, 60]);

function getCuttenColors(name, color100, color900) {
    const prefix = `--color-${name}-`;
    const piece = 8;
    const r = (color900[0] - color100[0]) / piece;
    const g = (color900[1] - color100[1]) / piece;
    const b = (color900[2] - color100[2]) / piece;

    for (const i of [-3, 0, 1, 2, 3, 4, 5, 6, 7, 8]) {
        const color = `${prefix}${i < 0 ? "50 " : `${i + 1}00`}        : rgb(${
            Math.round(color100[0] + r * i)
        } ${
            Math.round(color100[1] + g * i)
        } ${
            Math.round(color100[2] + b * i)
        });`;
        console.log(color);
    }
}