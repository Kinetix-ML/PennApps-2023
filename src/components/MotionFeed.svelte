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
            canvas.getContext('2d')?.clearRect(0, 0, video.clientWidth, video.clientHeight);
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
        bind:this={canvas}
    />
</div>

<style>
    .container {
        width: 50vw;
        overflow: hidden;
        position: relative;
    }
    video {
        width: 100%;
    }

    canvas {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
    }
</style>