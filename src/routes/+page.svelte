<script lang="ts">
	import Scene from '../components/Scene.svelte'
	import { Canvas } from '@threlte/core';
	import MotionFeed from '../components/MotionFeed.svelte';

	let outputs = []
</script>

<div class="w-screen h-screen">
	<MotionFeed bind:outCenter={outputs}/>
	<div class="w-full h-full z-20 absolute top-0 left-0">
		<Canvas>
			<Scene torsoCenter={outputs}/>
		</Canvas>
	</div>
	
</div>
