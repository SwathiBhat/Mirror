var mirror = {};
var renderer, scene, light, mesh;
var slide = document.getElementById('slider');
var radius = document.getElementById('radius');
var source, mat, canvas, cont;
var video = document.createElement('video');
var texture;

video.autoplay = true;
navigator.webkitGetUserMedia({video: true},success, function(err) {
    console.log(err);
});

function success(stream){
    video.src = webkitURL.createObjectURL(stream);
}

texture = THREE.ImageUtils.loadTexture('assets/08.jpg', {}, onload);

function animate(){
    requestAnimationFrame(animate);
    if(video.readyState === video.HAVE_ENOUGH_DATA){
        cont.clearRect(0,0,300,200);
        cont.drawImage(video,0,0,300,200);

        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        
        mat.map = texture;
        mat.map.repeat.set(1 -(radius.value/10), 1);
        cubeCam.updateCubeMap(renderer, scene);
        
        renderer.clear();
        renderer.render(scene, camera);
    }
}

cubeCam = new THREE.CubeCamera(5, 4000, 1024);
cubeCam.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    
mirror.material = new THREE.MeshPhongMaterial({
    envMap: cubeCam.renderTarget,
    color: 0xffffff,
    shininess: 500,
    shading: THREE.SmoothShading,
    reflectivity:1
});

mirror.material.envMap.needsUpdate = true;
mirror.material.overdraw = true;

function onload(){
    mat = new THREE.MeshPhongMaterial({map: texture});
    mat.map.needsUpdate = true;
    
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000,2000), mat);
    mesh.scale.x = -1;
    mesh.position.set(0,0,1400);
    
    mesh.visibility = false;
    
    camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 1, 4000);
    camera.position.set(0,0,800);
    
    scene = new THREE.Scene();
    
    scene.add(mesh);
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    var container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
    
    mirror.geometry = new THREE.SphereGeometry(700,100,100, Math.PI/2.1, Math.PI/21, Math.PI/2.12, Math.PI/17);
    
    mirror.mesh = new THREE.Mesh(mirror.geometry, mirror.material);
    
    scene.add(cubeCam);
    
    scene.add(mirror.mesh);
    
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
    
    light = new THREE.PointLight(0xffffff, 2, 800)
    light.castShadow = true;
    light.shadowDarkness = 0.8;
    light.position.set(0,0,800);
    
    camera.lookAt(scene.position);
        
    mirror.mesh.visible = false;
    
    cubeCam.updateCubeMap(renderer, scene);
    
    canvas = document.createElement('canvas');
        cont = canvas.getContext('2d');
    
    mirror.mesh.visible = true;
    mirror.material.envMap.needsUpdate = true;
    
    renderer.render(scene, camera);
    animate();
}

function move(){
    mesh.position.z = 1100 - slide.value*100;
    
    camera.lookAt(scene.position);
    mirror.mesh.visible = false;
    cubeCam.updateCubeMap(renderer, scene);
    mirror.mesh.visible = true;
    mirror.material.envMap.needsUpdate = true;
    
    renderer.render(scene, camera);
}

function rad(){
    mirror.geometry.dynamic = true;
    mat.map.repeat.set(1 -(radius.value/10), 1);
    
    camera.lookAt(scene.position);
    mirror.mesh.visible = false;
    cubeCam.updateCubeMap(renderer, scene);
    mirror.mesh.visible = true;
    mirror.material.envMap.needsUpdate = true;
    
    renderer.clear();
    renderer.render(scene, camera);
}   