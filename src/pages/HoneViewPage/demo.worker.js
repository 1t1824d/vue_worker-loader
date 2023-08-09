
import * as THREE from 'three';
onmessage = (e) => {
    console.log(e.data);
    console.log(`THREE`, THREE);
    const posArry = e.data; // e.data用于存储移动路线的数组
    const path = new THREE.LineCurve(posArry[0], posArry[1]);
    console.log(`path`, path);
    postMessage(path);

}

