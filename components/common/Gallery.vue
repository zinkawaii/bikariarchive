<script setup>
    const props = defineProps({
        illustrator: {
            type: String,
            required: true
        }
    });
</script>

<template>
    <div class="mb-gallery">
        <div class="gallery-illustration">
            <slot></slot>
        </div>
        <table class="navbox-table gallery-illustrator">
            <tbody>
                <tr>
                    <th>画师</th>
                    <td>{{ illustrator }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
    .gallery-illustration {
        display: grid;
        grid-gap: 16px;
    }

    .gallery-illustrator {
        margin-top: 8px;
        text-align: center;

        > th {
            width: 40%;
        }
    }
</style>