<template>
    <footer class="mx-auto text-darkGray" :class="props.addr ? 'py-6 border-lightGray border-solid border-t flex justify-between' : 'py-4'">
        <p>© 2019 HexHotel. All rights reserved.</p>
        <p v-if="props.addr">
            No. 5, Kaokao St., Kaohsiung City 803, Taiwan
        </p>
    </footer>
</template>

<script>
export default {
    name: 'VueFooter',
    props: {
        addr: {
            type: Boolean,
            default: false
        }
    },
    setup (props) {
        return {
            props
        };
    }
};
</script>

<style>

</style>
