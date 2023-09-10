<script lang="ts">
    import type { KMLPipeline } from 'kml-pipe-ts';
    import { onMount } from 'svelte';

    let video : HTMLVideoElement
    let canvas : HTMLCanvasElement
    let pipe : KMLPipeline
    let outputs = []
    let processing = false
    
    onMount(async () => {
        await loadDemoPipe()
        await startWebcam();
    })

    const runInference = async () => {
        if (!processing) {
            processing = true;
            canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
            outputs = await pipe.execute([video, canvas]);
            console.log(outputs);
            processing = false;
            video.requestVideoFrameCallback(runInference);
        }
    };

    const loadDemoPipe = async () => {
        const { KMLPipeline } = await import('kml-pipe-ts');
        //console.log(KEY);
        pipe = new KMLPipeline("PennApps", 1, "79705c77-f57b-449d-b856-03138e8859a7");
        await pipe.initialize();
    };

    const startWebcam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {width: 1280, height: 800} });
        video.srcObject = stream;
        await video.play();
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        video.width = video.clientWidth
        video.height = video.clientHeight
        video.requestVideoFrameCallback(runInference);
    };
</script>

<div class="container">
    <video
        id="webcam"
        autoplay
        class="rounded-lg shadow-lg w-full h-full object-fill"
        bind:this={video}
    />
    <canvas
        id="canvas"
        class="absolute z-10 top-0 left-0 overflow-hidden"
        width="1280"
        height="800"
        bind:this={canvas}
    />
</div>

<style>
    .container {
        max-height: 100vh;
        max-width: 100vw;
        aspect-ratio: 1280 / 800;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        width: auto;
        height: auto;
    }
    video {
        width: 100%;
        height: 100%;
        z-index: 9;
    }
    canvas {
        width: 100%;
        height: 100%;
        z-index: 10;
    }
</style>