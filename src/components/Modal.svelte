<script>
    export let open = false;
</script>

<div class="fixed inset-0 bg-white-200/50 backdrop-blur-sm z-30 transition-all" style={open ? "" : "opacity:0"} />
<div data-open={open} class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white-50/5
shadow-glass z-50 p-10 rounded-xl transition-all backdrop-blur-3xl
opacity-0 data-[open=true]:opacity-100 scale-95 data-[open=true]:scale-100">
    <slot />
</div>