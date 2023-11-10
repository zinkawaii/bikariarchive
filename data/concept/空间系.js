const ability = require("@core/Ability");

module.exports = {
    title: "空间系",
    summary: /*HTML*/`
        <p>空间系，作用于物理空间的能力系别。视所能达到的维度的不同，各个体之间对于能力的认识与运用方式天差地别，但在对空间本身的理解上有着共通之处。</p>
    `,
    details: [
        {
            title: "已知能力",
            content: ability.renderByClass("空间")
        }
    ]
};