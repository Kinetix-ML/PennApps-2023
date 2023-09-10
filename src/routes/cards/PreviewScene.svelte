<script lang="ts">
    import { T, useFrame, useThrelte, type AsyncWritable } from '@threlte/core'
    import type * as Clothes from '../../components/clothes/types';
    import * as ClothMeshes from '../../components/Clothes';
	import type { ThrelteGltf } from '@threlte/extras';
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
    let shirt: Group;
    let shirtMesh: SkinnedMesh;
    let diffusionCam: PerspectiveCamera;

    export let imageData: string = '';

    const { start } = useFrame(() => {
    }, {autostart: false})

    const onChange = () => {
        gltf.then(async (e) => {
            shirtMesh = <SkinnedMesh>shirt.children[shirt.children.length - 1];

            const texture = new TextureLoader().load(`data:image/png;base64,${imageData}`);
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
    fov={50}
    aspect={1}
    near={0.1}
    far={100}
    position={[0, 0.35, 1]}
    makeDefault
>
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
</T.PerspectiveCamera>

<T.AmbientLight />
<T.DirectionalLight color={[1, 1, 1]}/>

<ClothMeshes.Shirt bind:ref={shirt} bind:gltf={gltf} on:create={onChange}/> 