<script lang="ts">
    import Lenis from "@studio-freight/lenis";
	import { onMount } from "svelte";
	import Card from "../../components/Card.svelte";
	import Modal from "../../components/Modal.svelte";

    const cardWidth = 320
    let padding = 425; // will be set later based on screen size

    let currentIndex = 0;
    function snap(lenis: Lenis) {
        // find current card
        currentIndex = Math.floor(((lenis.targetScroll - padding) + (lenis.dimensions.width / 2))/(lenis.dimensions.scrollWidth - (padding*2))*cards.length)
        let currentCard = wrapper.children[currentIndex] as HTMLElement;

        if (Math.abs(lenis.velocity) < 3) {
            lenis.scrollTo(currentCard.offsetLeft - (cardWidth * 1.5));
        }
    }
    
    let wrapper: HTMLElement;

    let lastScroll = 0;
    onMount(() => {
        // set padding
        padding = (window.innerWidth / 2) - (cardWidth / 2);

        const lenis = new Lenis({
            orientation: "horizontal",
            wheelMultiplier: 2,
            lerp: 0.07,
        });
        snap(lenis); // TODO: needed?

        lenis.on("scroll", (l: Lenis) => {
            snap(l);
            if (lastScroll < l.scroll && l.scroll % 320 < lastScroll % 320 ||
                lastScroll > l.scroll && l.scroll % 320 > lastScroll % 320) {
                console.log("playing", lastScroll, l.scroll);
                new Audio("click2.wav").play();
            }
            lastScroll = l.scroll;
        })


        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // functions
        shiftLeft = () => {
            if (lenis.scroll > (cardWidth + padding)) {
                lenis.scrollTo(lenis.scroll - cardWidth);
            }
        }
        shiftRight = () => {
            if (lenis.scroll < lenis.dimensions.scrollWidth - padding) {
                lenis.scrollTo(lenis.scroll + cardWidth);
            }
        }
        
    })

    const cards = Array(20).fill(null);

    let shiftLeft: Function;
    let shiftRight: Function;

    let modalOpen = false;

</script>

<div class="fixed inset-0 bg-[url('/blob-background.svg')]" />

<div class="absolute top-1/2 -translate-y-1/2">
    <div class="flex flex-row no-scrollbar gap-4 items-center" style={padding ? `padding: ${padding}px` : ""} bind:this={wrapper}>
        {#each cards as card, index}
            <Card {index} {currentIndex}>{index}</Card>
        {/each}
    </div>
</div>

<!-- <p class="fixed top-5 left-6 font-logo text-4xl translate-y-1 holographic-text blur-3xl">Dreamwear</p> -->
<p class="fixed top-5 left-6 font-logo text-4xl translate-y-1 text-[#a28cbb] blur-[8px]">Dreamwear</p>
<p class="fixed top-5 left-6 font-logo text-4xl">Dreamwear</p>
<button class="fixed top-5 right-6 text-4xl w-10 h-10 backdrop-blur-xl holographic-text
            cursor-pointer font-bold bg-white-50 shadow-glass-small rounded-md">
    +
</button>

<Modal {modalOpen}>
    This is some text
</Modal>

<style>
    :global(body) {
        overflow: hidden;
    }
</style>