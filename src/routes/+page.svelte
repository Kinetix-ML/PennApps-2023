<script lang="ts">
	import Scene from '../components/Scene.svelte'
	import { Canvas } from '@threlte/core';
	import MotionFeed from '../components/MotionFeed.svelte';
</script>

<div class="w-screen h-screen">
<Canvas>
	<Scene />
</Canvas>
<MotionFeed/>
</div>
