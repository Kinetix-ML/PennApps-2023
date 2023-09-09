<script lang="ts">
    export let width = "w-80";
    export let height = "h-80";
    export let opacity = "opacity-50";
    export let index: number;
    export let currentIndex: number;

    let heightClass: string;
    let opacityClass: string;
    let colorClass: string;
    function updateSize(currentIndex: number) {
        if (currentIndex == index) {
            heightClass = "h-[600px]";
            opacityClass = "opacity-80";
            colorClass = "bg-white-50";
        } else if (Math.abs(currentIndex - index) == 1) {
            heightClass = "h-96";
            opacityClass = "opacity-60";
            colorClass = "bg-white-100";
        } else {
            heightClass = height;
            opacityClass = opacity;
            colorClass = "bg-white-200";
        }
    }
    updateSize(currentIndex);
    
    $: {
        // for it to track currentIndex it needs to be used
        updateSize(currentIndex);
    }

</script>

<div class={`card ${width} ${heightClass} ${opacityClass} ${colorClass}
bg-[rgba(235,235,235)] shadow-glass rounded-xl backdrop-blur-xl transition-all`}>
    <slot />
</div>