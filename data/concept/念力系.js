const ability = require("@core/Ability");

module.exports = {
    title: "念力系",
    summary: /*HTML*/`
        <p>念力系，使用看不见的力量对事物隔空造成影响的能力系别。</p>
    `,
    details: [
        {
            title: "已知能力",
            content: ability.renderByClass("念力")
        }
    ]
};