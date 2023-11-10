const ability = require("@core/Ability");

module.exports = {
    title: "光学系",
    summary: /*HTML*/`
        <p>光学系，利用光学的知识引发超自然现象的能力系别，通常指对从微波到γ射线的宽波段范围内的电磁波的运用。无法违背波粒二象性。</p>
    `,
    details: [
        {
            title: "已知能力",
            content: ability.renderByClass("光学")
        }
    ]
};