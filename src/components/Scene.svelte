<script lang="ts">
    import { Canvas, T, useFrame, useThrelte, type AsyncWritable } from '@threlte/core'
	import type * as Clothes from './clothes/types';
    import * as ClothMeshes from './Clothes.js'
	import { OrbitControls, type ThrelteGltf } from '@threlte/extras';

    let gltf : AsyncWritable<ThrelteGltf<Clothes.Shirt>>
    let nodes : Clothes.Shirt['nodes']

    const { start } = useFrame(() => {
        // example code, use nodes here to do stuff
        nodes["DEF-spine"].rotation.y += 0.01
    }, {autostart: false})

    const onChange = () => {
        gltf.then(e => {
            nodes = e.nodes
            start()
        })
    }
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

<T.AmbientLight />
<T.DirectionalLight />

<ClothMeshes.Shirt bind:gltf={gltf} on:create={onChange}/> 