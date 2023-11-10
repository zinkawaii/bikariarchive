const ability = require("@core/Ability");

module.exports = {
    title: "能力评级",
    summary: /*HTML*/`
        <p>能力评级，全称科学超现实能力评级（Scientific Transreal Ability Rank，简称Star）。蝴蝶岛以能力的强弱为标准，将幻现者分为Star 0,1,2,3,4,5六个等级。Star 0基本等于无能力，Star 1能将能力初步发挥，Star 2能让日常生活得到便利，Star 3能在战斗方面深得造诣，Star 4能发挥到涉及军事领域的程度。至于Star 5，则被判定为十三位Star 4合力都无法击败、能够独自一人面对一整支军队的存在。</p>
    `,
    details: [
        {
            title: "分类",
            content: /*HTML*/`
                <h3>Star 5</h3>
                ${ability.renderByStar(5)}
                <h3>Star 4</h3>
                ${ability.renderByStar(4)}
                <h3>Star 3</h3>
                ${ability.renderByStar(3)}
                <h3>Star 2</h3>
                ${ability.renderByStar(2)}
                <h3>Star 1</h3>
                ${ability.renderByStar(1)}
                <h3>Star 0</h3>
                ${ability.renderByStar(0)}
            `
        }
    ]
};