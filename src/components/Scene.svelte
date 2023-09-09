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
    import type {
        CameraHelper,
        PerspectiveCamera
    } from 'three'

    let gltf : AsyncWritable<ThrelteGltf<Clothes.Shirt>>;
    let nodes : Clothes.Shirt['nodes'];

    const { renderer, scene } = useThrelte();

    let helperA: CameraHelper;
    let diffusionCam: PerspectiveCamera;
    const renderTarget = new WebGLRenderTarget(512, 512);

    const { start } = useFrame(() => {
        if (renderer) {
            renderer.setRenderTarget(renderTarget);
            renderer.setSize(512, 512, false);
            diffusionCam.aspect = 1
            renderer.render(scene, diffusionCam);
            
            renderer.setSize(innerWidth, innerHeight, true);
            renderer.setRenderTarget(null);
        }
    }, {autostart: false})

    const onChange = () => {
        gltf.then(e => {
            nodes = e.nodes
            start()
        })
    };

</script>

<T.PerspectiveCamera
    fov={90}
    aspect={1}
    near={0.1}
    far={100}
    position={[1, 1, 1]}
    makeDefault
    on:create={({ ref }) => {
        ref.lookAt(0, 0, 0)
    }}
><OrbitControls/></T.PerspectiveCamera>

<!-- Camera for StableDiffusion -->
<T.PerspectiveCamera
    let:ref
    fov={20}
    aspect={1}
    near={0.1}
    far={50}
    position={[0, 0.35, 2.15]}
    bind:ref={diffusionCam}
    on:create={({ ref }) => {
        ref.lookAt(0, 0, 0)
    }}
>
    <TransformControls
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
    </Portal>
</T.PerspectiveCamera>


<T.AmbientLight />
<T.DirectionalLight color="white"/>

<ClothMeshes.Shirt bind:gltf={gltf} on:create={onChange}/> 
