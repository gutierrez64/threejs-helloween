const canvas = document.querySelector('.webgl');

gsap.from('.overlay h1 span', {
    duration: 1,
    y: '100%'
});

const overlay = document.querySelector('.overlay')
const loadingManager = new THREE.LoadingManager(
    () => {
        window.setTimeout(() => {
            gsap.to('.overlay h1 span', {
                duration: 1,
                y: '-100%'
            })
            
            gsap.to(overlay, {
                duration: 2,
                opacity: 0,
                delay: 1
            })
            gsap.to(overlay, {
                duration: 1,
                display: 'none',
                delay: 2
            })

        }, 2000)
    }
);


//Scene
const scene = new THREE.Scene();

//GLTF Model
const base = new THREE.Object3D();
scene.add(base);
const gltfLoader = new THREE.GLTFLoader(loadingManager)
gltfLoader.load('./assets/gltf/scene.gltf', (gltf) => {
    gltf.scene.position.y = -1;
    base.add(gltf.scene);
})

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
camera.position.z = 7;
scene.add(camera);

//Lights
//pointLight 1
const pointLight = new THREE.PointLight(0xff007f, 5);
pointLight.position.z = 0.5;
//pointLight 2
const pointLight2 = new THREE.PointLight(0x00008b, 5);
pointLight2.position.z = 0.5;

scene.add(pointLight);
scene.add(pointLight2);


//Mouse move
var mouse = new THREE.Vector2();
canvas.addEventListener("mousemove", onMouseMove);
//Mouse click
canvas.addEventListener("click", (e)=>{
    pointLight2.position.x = e.x;
    pointLight2.position.y = e.y;
})

const cursor = document.querySelector(".cursor");
const cursorBorder = document.querySelector(".cursor-border");

const cursorPos = new THREE.Vector2();
const cursorBorderPos = new THREE.Vector2();


function onMouseMove(e) {

    cursorPos.x = e.clientX;
    cursorPos.y = e.clientY;

    mouse.x = (cursorPos.x / sizes.width) * 2 - 1;
    mouse.y = -(cursorPos.y / sizes.height) * 2 + 1;

    pointLight.position.x = mouse.x;
    pointLight.position.y = mouse.y;


    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursor.style.opacity = 1;
    cursor.style.visibility = 'visible';
   
    cursorBorder.style.opacity = 1;
    cursorBorder.style.visibility = 'visible';
}

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antiAlias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);

renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);

    base.rotation.y -= 0.005;

    const easting = 8;
    cursorBorderPos.x += (cursorPos.x - cursorBorderPos.x) / easting;
    cursorBorderPos.y += (cursorPos.y - cursorBorderPos.y) / easting;

    cursorBorder.style.transform = `translate(${cursorBorderPos.x}px, ${cursorBorderPos.y}px)`;
});