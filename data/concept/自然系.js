const ability = require("@core/Ability");

module.exports = {
    title: "自然系",
    summary: /*HTML*/`
        <p>自然系，借助大自然的力量发挥本领的能力系别。大自然既可以是日月星辰，也可以是山水草木。与元素系的根本区别在于，它不可以凭空制造现象，而必须通过某种途径与大自然建立联系。</p>
    `,
    details: [
        {
            title: "已知能力",
            content: ability.renderByClass("自然")
        }
    ]
};