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
    import type {
        CameraHelper,
        Group,
        Mesh,
        OrthographicCamera,
        PerspectiveCamera,
		SkinnedMesh,
    } from 'three'
    import { Vector2, TextureLoader } from 'three';
    import ProjectedMaterial from 'three-projected-material'

    let gltf: AsyncWritable<ThrelteGltf<Clothes.Shirt>>;
    let nodes: Clothes.Shirt['nodes'];
    let shirt: Group;
    let shirtMesh: SkinnedMesh;

    const { renderer, scene } = useThrelte();

    let helperA: CameraHelper;
    let diffusionCam: PerspectiveCamera;
    let mainCam: PerspectiveCamera;

    let prompt = 'blue shirt, fake tie, masterpiece, realistic';
    let depthImage = 'shirt';
    let imageData = '';

    const { start } = useFrame(() => {
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
                .catch(err => console.error(err));

            const texture = new TextureLoader().load(`data:image/png;base64,${imageData}`);
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
            diffusionCam.updateWorldMatrix(true, true);*/
            
            start();
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
