<script>
    export let open = false;
</script>

<div data-open={open} class="group">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fixed inset-0 bg-white-200/50 backdrop-blur-sm z-30 transition-all"
    style={open ? "" : "opacity:0;pointer-events:none"} on:click={()=> open = false} on:keydown={() => open = false}/>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white-50/8
    shadow-glass z-50 p-10 rounded-xl transition-all backdrop-blur-3xl pointer-events-none
    opacity-0 group-data-[open=true]:opacity-100 scale-95 group-data-[open=true]:scale-100
    group-data-[open=true]:pointer-events-none">
        <slot />
    </div>
    <button class="fixed top-5 right-6 text-4xl w-10 h-10 backdrop-blur-xl holographic-text
        cursor-pointer font-bold bg-white-50 shadow-glass-small rounded-md z-50 transition-all
        opacity-0 group-data-[open=true]:opacity-100 group-data-[open=false]:pointer-events-none"
        on:click={()=>open = false}>
        <div class="rotate-45">+</div>
    </button>
</div>