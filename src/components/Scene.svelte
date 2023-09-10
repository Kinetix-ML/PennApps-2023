<script lang="ts">
    import { T, useFrame, useThrelte, type AsyncWritable } from '@threlte/core'
    import type * as Clothes from './clothes/types';
    import * as ClothMeshes from './Clothes.js'
    import { WebGLRenderTarget } from 'three';
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
    } from 'three'
    import { Vector2, TextureLoader } from 'three';
    import ProjectedMaterial from 'three-projected-material'
	import { DataType } from 'kml-pipe-ts/dist/base_structs';

    let gltf: AsyncWritable<ThrelteGltf<Clothes.Shirt>>;
    let nodes: Clothes.Shirt['nodes'];
    let shirt: Group;
    let shirtMesh: SkinnedMesh;

    export let torsoCenter

    const { renderer, scene } = useThrelte();

    let helperA: CameraHelper;
    let diffusionCam: PerspectiveCamera;
    let mainCam: PerspectiveCamera;

    // center: [x, y, z]; torsoPoints: [{x, y, z}...]
    const { start } = useFrame(() => {
        if (torsoCenter && torsoCenter.center && torsoCenter.torsoPoints.length > 0) {
            shirt.position.x = torsoCenter.center[0] * 3.2
            shirt.position.y = torsoCenter.center[1]
            shirt.position.z = -torsoCenter.center[2] / 300
            
            // nodes["DEF-shoulderR"].position.x = torsoCenter.torsoPoints[0].x
            // nodes["DEF-shoulderR"].position.y = torsoCenter.torsoPoints[0].y
            // nodes["DEF-shoulderR"].position.z = torsoCenter.torsoPoints[0].z / 140
        }
        
    }, {autostart: false})

    const onChange = () => {
        gltf.then(e => {
            nodes = e.nodes;
            shirtMesh = <SkinnedMesh>shirt.children[shirt.children.length - 1];
            const texture = new TextureLoader().load('./shirt.png');
            const material = new ProjectedMaterial({
                camera: diffusionCam, 
                texture, 
                cover: true, 
                textureScale: 1,
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
    fov={60}
    aspect={1}
    near={0.1}
    far={100}
    position={[0, 0.35, 2.15]}
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
