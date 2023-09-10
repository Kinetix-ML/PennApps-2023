<script lang="ts">
    import type { KMLPipeline } from 'kml-pipe-ts';
    import { createEventDispatcher, onMount } from 'svelte';

    let video : HTMLVideoElement
    let canvas : HTMLCanvasElement
    let pipe : KMLPipeline
    export let outCenter: Object | undefined = {}
    let processing = false
    
    const dispatch = createEventDispatcher();

    onMount(async () => {
        await loadDemoPipe()
        await startWebcam();
    })

    const runInference = async () => {
        if (!processing) {
            processing = true;
            canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
            let outputs = await pipe.execute([video, canvas]);
            
            const handTestPoints = [8, 7, 12, 11, 16, 15, 20, 19]
            const torsoTestPoints = [12, 11, 24, 23]

            if (!(outputs[0].value instanceof String)) {
                let deltaMove = handTestPoints.map(e => outputs[1].value[e]*(outputs[0].value.keypoints[e].z+1)).reduce((a, b) => a + b, 0) / handTestPoints.length
                if (Math.abs(deltaMove) > 120) {
                    console.log(`swipe ${deltaMove > 0 ? "right" : "left"}`)
                    if (deltaMove > 0) {dispatch("swipeRight")} else {dispatch("swipeLeft")};
                }
            }

            if (outputs.length > 2 && !(outputs[3].value instanceof String)) {

                let center = Object.values(torsoTestPoints
                        .map(e => outputs[3].value.keypoints[e])
                        .reduce((a, b) => ({x: a.x+b.x, y: a.y+b.y, z: a.z+b.z})))
                        .map(e => (e as number)/4)

                        center[0] /= canvas.width
                center[1] /= canvas.height
                center[0] -= 0.5
                center[1] -= 0.5
                center[1] = -center[1]

                let torsoPoints = torsoTestPoints
                        .map(e => outputs[3].value.keypoints[e])
                        .map(({x, y, z}) => ({x: x / canvas.width - 0.5 - center[0], y: -y / canvas.height + 0.5 - center[1], z: z - center[2]}))
                        //.reduce((a, b) => ({x: a.x+b.x, y: a.y+b.y, z: a.z+b.z})))
                        //.map(e => (e as number)/4)
                
                

                outCenter = {center: [...center], torsoPoints: [...torsoPoints]}
            } else {
                outCenter = undefined
            }
            
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


<div>
    <video
    id="webcam"
        autoplay
        bind:this={video}
    />
    <canvas
    id="canvas"
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