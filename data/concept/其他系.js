const ability = require("@core/Ability");

module.exports = {
    title: "其他系",
    summary: /*HTML*/`
        <p>其他系，所有未被明确分类的能力都暂时归为此系别。</p>
    `,
    details: [
        {
            title: "已知能力",
            content: ability.renderByClass("其他")
        }
    ]
};