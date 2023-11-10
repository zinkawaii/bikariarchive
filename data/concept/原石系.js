const ability = require("@core/Ability");

module.exports = {
    title: "原石系",
    summary: /*HTML*/`
        <p>原石系，未经过系统的能力开发，自然觉醒的能力系别。本质依然基于幻想解放理论，但具体的能力机制较为模糊，甚至连拥有者本人也无法掌握其全貌。</p>
    `,
    details: [
        {
            title: "已知能力",
            content: ability.renderByClass("原石")
        }
    ]
};