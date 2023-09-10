<script lang="ts">
	import { currentTexture } from "../stores";

    export let width = "w-80";
    export let height = "h-80";
    export let index: number;
    export let currentIndex: number;

    let heightClass: string;
    let widthClass: string;
    let opacityClass: string;
    let colorClass: string;
    function updateSize(currentIndex: number) {
        if (currentIndex == index) {
            heightClass = "h-[600px]";
            opacityClass = "opacity-0";
            colorClass = "bg-white-50";
            widthClass = "w-[500px]"
        } else if (Math.abs(currentIndex - index) == 1) {
            heightClass = "h-96";
            opacityClass = "opacity-100"
            colorClass = "bg-white-100/80";
            widthClass = width;
        } else {
            heightClass = height;
            opacityClass = "opacity-100";
            colorClass = "bg-white-200/50";
            widthClass = width;
        }
    }
    updateSize(currentIndex);
    
    $: {
        // for it to track currentIndex it needs to be used
        updateSize(currentIndex);
    }

</script>

<div class={`card ${widthClass} ${heightClass} ${opacityClass} ${colorClass}
shadow-glass rounded-xl backdrop-blur-xl transition-all`}>
    <slot />
</div>