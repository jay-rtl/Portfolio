import {Scene,PerspectiveCamera,WebGLRenderer,Mesh,MeshPhysicalMaterial,MeshStandardMaterial,MeshBasicMaterial,SphereGeometry,IcosahedronGeometry,TorusGeometry,PlaneGeometry,TextureLoader,PMREMGenerator,Group,ACESFilmicToneMapping,SRGBColorSpace,DirectionalLight,HemisphereLight} from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';

export function mountScene(host) {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:760px)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const canvas=document.createElement('canvas');
  let gl;
  try {gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});} catch { /* The environment plate remains the fallback. */ }
  if(!gl){host.dataset.scene='fallback';return null;}
  let renderer;
  try {renderer=new WebGLRenderer({canvas,context:gl,alpha:true,antialias:true,powerPreference:'low-power'});} catch {host.dataset.scene='fallback';return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile.matches?1:1.25));
  renderer.transmissionResolutionScale=mobile.matches ? .5 : .65;
  renderer.setClearColor(0x000000,0);
  renderer.toneMapping=ACESFilmicToneMapping;
  renderer.outputColorSpace=SRGBColorSpace;
  renderer.toneMappingExposure=1.35;
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden','true');
  renderer.domElement.dataset.glassCanvas='';
  const scene=new Scene();
  const camera=new PerspectiveCamera(39,1,.1,40);
  camera.position.set(0,.1,8.4);
  const pmrem=new PMREMGenerator(renderer);
  const room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,0,.1,100,{size:128});
  scene.environment=environment.texture;
  room.dispose();pmrem.dispose();
  scene.add(new HemisphereLight(0xffffff,0x16171a,2));
  const key=new DirectionalLight(0xffffff,4);key.position.set(-3,5,5);scene.add(key);
  const rim=new DirectionalLight(0xffffff,5);rim.position.set(4,1,-2);scene.add(rim);
  const group=new Group();scene.add(group);
  const glass=new MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:.015,transmission:1,thickness:1.1,ior:1.45,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:1.4});
  const stone=new MeshStandardMaterial({color:0x050506,metalness:.8,roughness:.24,envMapIntensity:1.2});
  const spheres=[];
  const positions=[[-1.45,1.75,.5,.6],[1.85,.95,.3,.4],[-1.7,-.45,.8,.37],[1.45,-1.4,1,.46]];
  const geometry=new SphereGeometry(1,mobile.matches?28:36,mobile.matches?20:28);
  positions.forEach(([x,y,z,r],i)=>{
    const sphere=new Mesh(geometry,glass);sphere.position.set(x,y,z);sphere.scale.setScalar(r);sphere.userData={baseY:y,phase:i*1.8};spheres.push(sphere);group.add(sphere);
  });
  const ring=new Mesh(new TorusGeometry(1.7,.013,8,144),new MeshBasicMaterial({color:0xe5e8ef,transparent:true,opacity:.8}));
  ring.position.set(.65,.6,-1.5);ring.rotation.set(.25,-.45,.22);group.add(ring);
  const halo=new Mesh(new TorusGeometry(1.73,.033,6,120),new MeshBasicMaterial({color:0xe5e8ef,transparent:true,opacity:.08}));
  halo.position.copy(ring.position);halo.rotation.copy(ring.rotation);group.add(halo);
  const rockGeometry=mergeVertices(new IcosahedronGeometry(1,3));
  const vertices=rockGeometry.attributes.position;
  for(let i=0;i<vertices.count;i++) {
    const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i);
    const shape=1+Math.sin(x*12+y*9)*Math.sin(z*11-y*5)*.13;
    vertices.setXYZ(i,x*shape,y*shape,z*shape);
  }
  rockGeometry.computeVertexNormals();
  for(let i=0;i<2;i++) {
    const rock=new Mesh(rockGeometry,stone);rock.position.set(.65+i*.7,.2+i*.24,-2.2);rock.scale.set(.5,1.7-i*.35,.47);rock.rotation.set(.15,.35+i*.6,-.22+i*.2);group.add(rock);
  }
  // A camera-aligned environment plane lets physical glass refract the real landscape.
  const heroImage=host.closest('.obsidian-hero').querySelector('.hero-environment img');
  const backgroundTexture=new TextureLoader().load(heroImage.currentSrc||heroImage.src);
  backgroundTexture.colorSpace=SRGBColorSpace;
  const background=new Mesh(new PlaneGeometry(1,1),new MeshBasicMaterial({map:backgroundTexture}));
  // Sample the landscape inside glass, but never redraw it over the HTML backdrop.
  background.onBeforeRender=activeRenderer=>{background.material.colorWrite=activeRenderer.getRenderTarget()!==null;};
  background.position.set(0,.1,-7);scene.add(background);
  const resize=()=>{
    const {width,height}=host.getBoundingClientRect();if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
    camera.position.z=Math.max(mobile.matches?9.3:8.4,2.7/(Math.tan(camera.fov*Math.PI/360)*camera.aspect));
    const imageRect=heroImage.getBoundingClientRect(),rect=host.getBoundingClientRect();
    const naturalWidth=heroImage.naturalWidth||1672,naturalHeight=heroImage.naturalHeight||941;
    const scale=Math.max(imageRect.width/naturalWidth,imageRect.height/naturalHeight);
    const imageWidth=naturalWidth*scale,imageHeight=naturalHeight*scale;
    const x=(imageRect.width-imageWidth)*(mobile.matches ? .7 : .6),y=(imageRect.height-imageHeight)*.5;
    backgroundTexture.repeat.set(width/imageWidth,height/imageHeight);
    backgroundTexture.offset.set((rect.left-imageRect.left-x)/imageWidth,1-(rect.top-imageRect.top-y+height)/imageHeight);
    backgroundTexture.updateMatrix();
    const worldHeight=2*(camera.position.z-background.position.z)*Math.tan(camera.fov*Math.PI/360);
    background.scale.set(worldHeight*camera.aspect,worldHeight,1);
  };
  const resizer=new ResizeObserver(resize);resizer.observe(host);resize();
  let visible=true,frame=0,disposed=false,last=0,elapsed=0;
  let targetX=0,targetY=0;
  const render=now=>{
    frame=0;if(disposed)return;
    if(last&&now-last<(mobile.matches?32:24)){frame=requestAnimationFrame(render);return;}
    if(!last)last=now;const dt=Math.min((now-last)/1000,.05);last=now;
    if(!reduced.matches&&!document.hidden&&visible)elapsed+=dt;
    const animated=!reduced.matches&&!document.hidden&&visible;
    if(animated){
      spheres.forEach(sphere=>{sphere.position.y=sphere.userData.baseY+Math.sin(elapsed*.45+sphere.userData.phase)*.1;});
      group.rotation.y+=(targetX*.065-group.rotation.y)*.04;
      group.rotation.x+=(targetY*.045-group.rotation.x)*.04;
      ring.rotation.z=.22+Math.sin(elapsed*.12)*.07;
    }
    renderer.render(scene,camera);
    host.dataset.scene='ready';host.dataset.frame=String(Number(host.dataset.frame||0)+1);
    if(animated)frame=requestAnimationFrame(render);
  };
  const schedule=()=>{if(!frame&&!disposed){last=0;frame=requestAnimationFrame(render);}};
  const sync=()=>{if(frame)cancelAnimationFrame(frame);frame=0;schedule();};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'30px'});observer.observe(host);
  const pointer=event=>{
    if(!fine.matches||reduced.matches)return;
    const rect=host.getBoundingClientRect();targetX=(event.clientX-rect.left)/rect.width-.5;targetY=(event.clientY-rect.top)/rect.height-.5;
  };
  host.parentElement.addEventListener('pointermove',pointer,{passive:true});
  const visibility=()=>sync();document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener('change',sync);
  const lose=event=>{event.preventDefault();host.dataset.scene='fallback';if(frame)cancelAnimationFrame(frame);frame=0;};
  renderer.domElement.addEventListener('webglcontextlost',lose);
  schedule();
  return {
    dispose(){
      disposed=true;if(frame)cancelAnimationFrame(frame);observer.disconnect();resizer.disconnect();
      document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',sync);
      host.parentElement.removeEventListener('pointermove',pointer);renderer.domElement.removeEventListener('webglcontextlost',lose);
      const geometries=new Set(),materials=new Set();scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)materials.add(object.material);});
      geometries.forEach(item=>item.dispose());materials.forEach(item=>item.dispose());backgroundTexture.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove();
    }
  };
}
