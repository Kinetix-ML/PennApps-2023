<script lang="ts">
    import Lenis from "@studio-freight/lenis";
	import { onMount } from "svelte";
	import Card from "../../components/Card.svelte";
	import Modal from "../../components/Modal.svelte";
    import "@fontsource/dm-sans";

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

    // ui funcs
    let shirtButton: HTMLButtonElement;
    let hatButton: HTMLButtonElement;
    let goButton: HTMLButtonElement;
    function selectModalOption(option: "shirt" | "hat") {
        console.log(shirtButton, shirtButton.dataset.selected)
        console.log(hatButton, hatButton.dataset.selected)
        if (option == "shirt") {
            if (shirtButton.dataset.selected == "true") {
                shirtButton.dataset.selected = "false";
            } else {
                shirtButton.dataset.selected = "true";
                hatButton.dataset.selected = "false";
            }
        } else if (option == "hat") {
            if (hatButton.dataset.selected == "true") {
                hatButton.dataset.selected = "false";
            } else {
                hatButton.dataset.selected = "true";
                shirtButton.dataset.selected = "false";
            }
        }

        if (shirtButton.dataset.selected == "true" || hatButton.dataset.selected == "true") {
            goButton.dataset.active = "true";
        } else {
            goButton.dataset.active = "false";
        }
    }

    const cards = Array(20).fill(null);

    let shiftLeft: Function;
    let shiftRight: Function;

    let modalOpen = true;

</script>

<div class="fixed inset-0 bg-[url('/blob-background.svg')]" />

<div class="absolute top-1/2 -translate-y-1/2">
    <div class="flex flex-row no-scrollbar gap-4 items-center" style={padding ? `padding: ${padding}px` : ""} bind:this={wrapper}>
        {#each cards as card, index}
            <Card {index} {currentIndex}>{index}</Card>
        {/each}
    </div>
</div>

<p class="fixed top-5 left-6 font-logo text-4xl translate-y-1 text-[#a28cbb] blur-[8px]">Dreamwear</p>
<p class="fixed top-5 left-6 font-logo text-4xl">Dreamwear</p>
<button class="fixed top-5 right-6 text-4xl w-10 h-10 backdrop-blur-xl holographic-text
            cursor-pointer font-bold bg-white-50 shadow-glass-small rounded-md"
    on:click={()=>modalOpen = true}>
    +
</button>

<Modal bind:open={modalOpen}>
    <p class="text-center font-bold text-lg font-sans">Create some clothing</p>
    <p class="text-center text-sm font-sans mb-3">The limit is your imagination</p>
    <input type="text" placeholder="Whatever you want..."
    class="font-sans px-4 py-2 rounded-full bg-white-50/70 backdrop-blur-3xl
    border-2 border-white-200/50 outline-none focus:border-[#a28cbb] transition-colors
    duration-[50ms] w-full mb-2">
    <div class="flex flex-row gap-2 w-full mb-2">
        <button bind:this={shirtButton} data-selected="false" class="rounded-full bg-white-50/70 backdrop-blur-3xl 
        px-4 py-2 border-2 border-white-200/50 flex-1 data-[selected=true]:bg-[#dbb4d6]/50
        data-[selected=true]:border-[#d6bcd5]/50" on:click={()=>selectModalOption("shirt")}>Shirt</button>
        <button bind:this={hatButton} data-selected="false" class="rounded-full bg-white-50/70 backdrop-blur-3xl
        px-4 py-2 border-2 border-white-200/50 flex-1 data-[selected=true]:bg-[#dbb4d6]/50
        data-[selected=true]:border-[#d6bcd5]/50" on:click={()=>selectModalOption("hat")}>Hat</button>
    </div>
    <button bind:this={goButton} data-active="false" class="w-full holographic-bg rounded-full px-4 py-2 font-bold 
    font-sans data-[active=true]:hover:blue-glow transition-all duration-500 data-[active=false]:cursor-not-allowed">Go →</button>
</Modal>

<style>
    :global(body) {
        overflow: hidden;
    }
</style>