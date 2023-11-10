<script setup>
    useHead({
        title: "情报"
    });
</script>

<template>
    <div class="content-group">
        <div class="jouhou-block">
            <div class="jouhou-header">
                <nuxt-img class="jouhou-image" src="/garden/icon/浅井爱纱.png"/>
                <span>角色一览</span>
            </div>
            <table class="navbox-table">
                <tr>
                    <th colspan="3">东瀛</th>
                </tr>
                <tr>
                    <th rowspan="5" width="15%">初空</th>
                    <th class="navbox-ceil-odd" width="20%">微光茶馆</th>
                    <td>
                        <nuxt-link to="/御守真幻">御守真幻</nuxt-link> •
                        <nuxt-link to="/山吹风铃">山吹风铃</nuxt-link> •
                        <nuxt-link to="/云洋砂海">云洋砂海</nuxt-link> •
                        <nuxt-link to="/森谷雪绘">森谷雪绘</nuxt-link> •
                        <nuxt-link to="/蝶羽千印">蝶羽千印</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th class="navbox-ceil-even">风纪委第125支部</th>
                    <td>
                        <nuxt-link to="/若叶遥">若叶遥</nuxt-link> •
                        <nuxt-link to="/若叶舞">若叶舞</nuxt-link> •
                        <nuxt-link to="/浅井爱纱">浅井爱纱</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th class="navbox-ceil-odd">浅井一族</th>
                    <td>
                        <nuxt-link to="/浅井爱纱">浅井爱纱</nuxt-link> •
                        <nuxt-link to="/浅井花环">浅井花环</nuxt-link> •
                        <nuxt-link to="/浅井香草">浅井香草</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th class="navbox-ceil-even">八十八夜计划</th>
                    <td>
                        <nuxt-link to="/栗花落新月">栗花落新月</nuxt-link> •
                        <nuxt-link to="/三日月">三日月</nuxt-link> •
                        <nuxt-link to="/弦月">弦月</nuxt-link> •
                        <nuxt-link to="/满月">满月</nuxt-link> •
                        <nuxt-link to="/残月">残月</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th class="navbox-ceil-odd">其他</th>
                    <td>
                        <nuxt-link to="/赤岛晴川">赤岛晴川</nuxt-link> •
                        <nuxt-link to="/浮海沙希">浮海沙希</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th rowspan="2">？？？？</th>
                    <th class="navbox-ceil-even">???</th>
                    <td>
                        <nuxt-link to="/早川真绫">早川真绫</nuxt-link> •
                        <nuxt-link to="/四季萌花">四季萌花</nuxt-link> •
                        <nuxt-link to="/荒浪潮乃">荒浪潮乃</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th class="navbox-ceil-odd">　</th>
                    <td></td>
                </tr>
                <tr>
                    <th colspan="3">华夏</th>
                </tr>
                <tr>
                    <th>冬祈镇</th>
                </tr>
            </table>
        </div>
        <div class="jouhou-block">
            <div class="jouhou-header">
                <nuxt-img class="jouhou-image" src="/garden/icon/世界观设定.png"/>
                <span>世界观设定</span>
            </div>
            <table class="navbox-table">
                <tr>
                    <th colspan="3">地区</th>
                </tr>
                <tr>
                    <th rowspan="3" width="15%">蝴蝶岛</th>
                    <th class="navbox-ceil-odd" width="20%">东瀛</th>
                    <td>
                        <nuxt-link to="/清水">清水</nuxt-link> •
                        <nuxt-link to="/近江">近江</nuxt-link> •
                        <nuxt-link to="/羽端">羽端</nuxt-link> •
                        <nuxt-link to="/竹越">竹越</nuxt-link> •
                        <nuxt-link to="/未名">未名</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th class="navbox-ceil-even">华夏</th>
                    <td></td>
                </tr>
                <tr>
                    <th class="navbox-ceil-odd">蝶身</th>
                    <td>
                        <nuxt-link to="/沙海">沙海</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th colspan="3">概念</th>
                </tr>
                <tr>
                    <th rowspan="3">超能力</th>
                    <th class="navbox-ceil-odd">统括</th>
                    <td>
                        <nuxt-link to="/幻现者">幻现者</nuxt-link> •
                        <nuxt-link to="/能力评级">能力评级</nuxt-link>
                    </td>
                </tr>
                <tr>
                    <th class="navbox-ceil-even">系别</th>
                    <td>
                        <nuxt-link to="/元素系">元素</nuxt-link> •
                        <nuxt-link to="/自然系">自然</nuxt-link> •
                        <nuxt-link to="/精神系">精神</nuxt-link> •
                        <nuxt-link to="/空间系">空间</nuxt-link> •
                        <nuxt-link to="/念力系">念力</nuxt-link> •
                        <nuxt-link to="/生物系">生物</nuxt-link> •
                        <nuxt-link to="/光学系">光学</nuxt-link> •
                        <nuxt-link to="/视觉系">视觉</nuxt-link> •
                        <nuxt-link to="/量子系">量子</nuxt-link> •
                        <nuxt-link to="/原石系">原石</nuxt-link> •
                        <nuxt-link to="/其他系">其他</nuxt-link>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .jouhou-block {
        display: flex;
        align-items: flex-start;
        gap: 32px;

        & + & {
            margin-top: 32px;
        }
    }

    .jouhou-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px 24px 12px;
        border: 1px solid var(--color-border-light);
        border-left: 32px solid var(--color-theme-block);
        background-color: var(--color-background);
        font-weight: bold;
    }

    .jouhou-image {
        width: 100px;
        height: 100px;
        border-radius: 100%;
        box-shadow: 4px 4px 12px rgb(0 0 0 / 24%);
    }

    @media (width < 1024px) {
        .jouhou-block {
            gap: 16px;
        }
    }

    @container main (width < 768px) {
        .jouhou-block {
            flex-direction: column;
            align-items: center;
        }
    }
</style>