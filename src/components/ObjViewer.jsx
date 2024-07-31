import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import {OBJLoader} from 'three-stdlib';
import { Box3, Vector3 } from 'three';
import {useThree} from "react-three-fiber";
import { OrbitControls } from '@react-three/drei';

const Model = ({ url }) => {
  const obj = useLoader(OBJLoader, url);
  const { camera, gl } = useThree();
  const box = new Box3().setFromObject(obj);
  const size = box.getSize(new Vector3()).length();
  const center = box.getCenter(new Vector3());

  obj.position.x -= center.x;
  obj.position.y -= center.y;
  obj.position.z -= center.z;
  obj.rotation.y = 4;

  box.setFromObject(obj);
  center.copy(box.getCenter(new Vector3()));

  camera.lookAt(center);
  camera.position.copy(center);
  camera.position.x += size / 2.0;
  camera.position.y += size / 5.0;
  camera.position.z += size / 2.0;
  camera.updateProjectionMatrix();

  return <primitive object={obj} />;
};

export const ObjViewer = ({url}) => {
  return (
      <Canvas className={"g-obj-viewer"}>
        <ambientLight intensity={0.5}/>
        <pointLight position={[10, 10, 10]} intensity={0.5}/>
        <spotLight position={[0, 5, 10]} angle={0.3} intensity={0.5}/>
        <directionalLight position={[-10, -10, -10]} intensity={0.5}/>
        <Suspense fallback={null}>
          <Model url={url}/>
        </Suspense>
        <OrbitControls/>
      </Canvas>
  );
};