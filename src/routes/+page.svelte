<script lang="ts">
	import Scene from '../components/Scene.svelte'
	import { Canvas } from '@threlte/core';
	import MotionFeed from '../components/MotionFeed.svelte';
</script>

<div class="w-screen h-screen">
	<!--<MotionFeed/>-->
	<div class="w-full h-full z-20 relative">
		<Canvas>
			<Scene />
		</Canvas>
	</div>
	
</div>
