<script lang="ts">
    import type { KMLPipeline } from 'kml-pipe-ts';
    import { createEventDispatcher, onMount } from 'svelte';

    let video : HTMLVideoElement
    let canvas : HTMLCanvasElement
    let pipe : KMLPipeline
    export let outCenter: Object | undefined = {}
    let processing = false
    let moveTimer = 0
    
    const dispatch = createEventDispatcher();

    onMount(async () => {
        await loadDemoPipe()
        await startWebcam();
    })

    function screenToWorldFOV(keypoints2d: {x: number, y: number}[], depths: number[], fovDegrees: number, screenWidth: number, screenHeight: number) {
        // Calculate the focal length from the field of view and screen width
        let f = screenWidth / (2 * Math.tan(fovDegrees * Math.PI / 360));  // Convert FOV to radians

        let cx = screenWidth / 2;  // Image center x-coordinate
        let cy = screenHeight / 2;  // Image center y-coordinate

        let keypoints3dWorld = [];

        for(let i = 0; i < keypoints2d.length; i++) {
            let x = keypoints2d[i].x;
            let y = keypoints2d[i].y;
            let Z = 3 + depths[i];  // Depth value provided by BlazePose

            let X = (x - cx) * Z / f;
            let Y = (y - cy) * Z / f;

            keypoints3dWorld.push([X, Y, Z]);
        }

        return keypoints3dWorld;
    }

    const runInference = async () => {
        if (!processing) {
            processing = true;
            canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
            let outputs = await pipe.execute([video, canvas]);
            
            const handTestPoints = [8, 7, 12, 11, 16, 15, 20, 19]
            const torsoTestPoints = [24, 23]//[12, 11, 24, 23]

            if (!(outputs[0].value instanceof String)) {
                let deltaMove = handTestPoints.map(e => outputs[1].value[e]*(outputs[0].value.keypoints[e].z+1)).reduce((a, b) => a + b, 0) / handTestPoints.length
                if (Math.abs(deltaMove) > 70) {

                    if (deltaMove < 0 && moveTimer > 2) {dispatch("swipeRight")} else {dispatch("swipeLeft")};
                    moveTimer++
                } else {
                    moveTimer = 0
                }
            }

            if (outputs.length > 2 && !(outputs[3].value instanceof String)) {

                let center = Object.values(torsoTestPoints
                        .map(e => outputs[3].value.keypoints[e])
                        .reduce((a, b) => ({x: a.x+b.x, y: a.y+b.y, z: a.z+b.z})))
                        .map(e => (e as number)/4)
                console.log("z: "+center[2])
                //center = screenToWorldFOV([{x: center[0], y: center[1]}], [center[2]], 54, canvas.width, canvas.height)[0]
                center[0] /= canvas.width
                center[1] /= canvas.height
                center[0] -= 0.5
                center[1] -= 0.5
                center[1] = -center[1]

                let torsoPoints = [12, 11, 24, 23]
                        .map(e => outputs[3].value.keypoints3D[e])
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