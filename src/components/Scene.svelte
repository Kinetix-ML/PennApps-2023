<script lang="ts">
    import { T, useFrame, useThrelte, type AsyncWritable } from '@threlte/core'
    import type * as Clothes from './clothes/types';
    import * as ClothMeshes from './Clothes.js'
	import { 
        type ThrelteGltf,
        OrbitControls, 
        Portal, 
        TransformControls 
    } from '@threlte/extras';
    import {
	Group,
        type CameraHelper,
        type Mesh,
        type OrthographicCamera,
        type PerspectiveCamera,
		type SkinnedMesh,
		RGB_PVRTC_2BPPV1_Format,
    } from 'three'
    import { Vector2, TextureLoader, Vector3 } from 'three';
    import ProjectedMaterial from 'three-projected-material'
	import { DataType } from 'kml-pipe-ts/dist/base_structs';
    import { currentTexture } from '../stores';

    let gltf: AsyncWritable<ThrelteGltf<Clothes.Shirt>>;
    let nodes: Clothes.Shirt['nodes'];
    let shirt: Group;
    let shirtMesh: SkinnedMesh;

    export let torsoCenter: any;
    export let shirtTexture: string;

    const { renderer, scene } = useThrelte();

    let helperA: CameraHelper;
    let diffusionCam: PerspectiveCamera;
    let mainCam: PerspectiveCamera;

    $: $currentTexture, updateTexture();

    function updateTexture() {
        if (!shirtMesh) return;
        const texture = new TextureLoader().load($currentTexture);
        const material = new ProjectedMaterial({
            camera: diffusionCam, 
            texture, 
            cover: true, 
            textureScale: 0.6,
            color: '#ccc', 
            roughness: 0.95
        });
        shirtMesh.material = material;
        material.project(shirtMesh);
        diffusionCam.updateProjectionMatrix();
        diffusionCam.updateWorldMatrix(true, true);
    }

    // center: [x, y, z]; torsoPoints: [{x, y, z}...]
    const { start } = useFrame(() => {
        if (torsoCenter && torsoCenter.center && torsoCenter.torsoPoints.length > 0) {
            //shirt.position.set(...screenToWorld(torsoCenter.center[0], torsoCenter.center[1], torsoCenter.center[2]*2,mainCam))
            shirt.position.x = torsoCenter.center[0] * 3 + 0.05
            shirt.position.y = torsoCenter.center[1] * 2 - 0.1
            shirt.position.z = -1.1//torsoCenter.center[2] / 160
            console.log(torsoCenter.torsoPoints[0].x)
            // nodes["DEF-upper_armL"].position.x = -torsoCenter.torsoPoints[0].x
            // nodes["upper_arm_tweakL"].position.y = -torsoCenter.torsoPoints[0].y
            // nodes["upper_arm_tweakL"].position.z = -torsoCenter.torsoPoints[0].z
            // nodes["upper_arm_tweakR"].position.x = -torsoCenter.torsoPoints[1].x
            // nodes["upper_arm_tweakR"].position.y = -torsoCenter.torsoPoints[1].y
            // nodes["upper_arm_tweakR"].position.z = -torsoCenter.torsoPoints[1].z
            // nodes["thigh_tweakR"].position.x = torsoCenter.torsoPoints[2].x
            // nodes["thigh_tweakR"].position.y = torsoCenter.torsoPoints[2].y
            // nodes["thigh_tweakR"].position.z = torsoCenter.torsoPoints[2].z
            // nodes["thighL"].position.x = torsoCenter.torsoPoints[3].x
            // nodes["thighL"].position.y = torsoCenter.torsoPoints[3].y
            // nodes["thighL"].position.z = torsoCenter.torsoPoints[3].z
        }
        
    }, {autostart: false})

    const onChange = () => {
        gltf.then(async (e) => {
            nodes = e.nodes;
            shirtMesh = <SkinnedMesh>shirt.children[shirt.children.length - 1];

            /*const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: `{"prompt": "${prompt}", "depth": "${depthImage}.png"}`
            }

            await fetch('https://ce27-34-105-76-22.ngrok.io/', options)
                .then(response => response.json())
                .then(response => {imageData = response.image})
                .catch(err => console.error(err));*/
            
            const texture = new TextureLoader().load($currentTexture);
            const material = new ProjectedMaterial({
                camera: diffusionCam, 
                texture, 
                cover: true, 
                textureScale: 0.6,
                color: '#ccc', 
                roughness: 0.95
            });
            shirtMesh.material = material;
            material.project(shirtMesh);
            diffusionCam.updateProjectionMatrix();
            diffusionCam.updateWorldMatrix(true, true);
        
            start();
        })
    };

</script>

<T.PerspectiveCamera
    fov={30}
    aspect={1}
    near={0.1}
    far={100}
    position={[0, 0, 2]}
    makeDefault
    bind:ref={mainCam}
    on:create={({ ref }) => {
        ref.lookAt(0, 0, 0)
    }}
>
    <OrbitControls/>
</T.PerspectiveCamera>

<!-- Camera for StableDiffusion -->
<T.PerspectiveCamera
    let:ref
    fov={20}
    aspect={1}
    near={0.1}
    far={50}
    position={[0, 0.35, 2.15]}
    bind:ref={diffusionCam}
>
    <!--TransformControls
        object={ref}
        mode={'rotate'}
        on:objectChange={() => {
        if (!helperA) return
            helperA.update()
        }}
    />
    <Portal object={scene}>
        <T.CameraHelper
            args={[ref]}
            bind:ref={helperA}
        />
    </Portal>-->
</T.PerspectiveCamera>

<T.AmbientLight />
<T.DirectionalLight color={[1, 1, 1]}/>

<ClothMeshes.Shirt bind:ref={shirt} bind:gltf={gltf} on:create={onChange}/> 
