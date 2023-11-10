const ability = require("@core/Ability");

module.exports = {
    title: "视觉系",
    summary: /*HTML*/`
        <p>视觉系，对生物体的视觉造成影响的能力系别。有时与光学系造成的现象难以区分。</p>
    `,
    details: [
        {
            title: "已知能力",
            content: ability.renderByClass("视觉")
        }
    ]
};