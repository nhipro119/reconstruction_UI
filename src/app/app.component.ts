import { LoaderService } from './loader.service';


import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MaterialLoader } from 'three';
import { PrintingService } from './printing.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private service: PrintingService, public loaderService: LoaderService) {

  }


  // ngOnInit() {
  //   this.loadObjFileFromAPI()
  // }
  title = 'demoPrintingAPI';

  responseData!: Blob;
  f!: File;
  url!: any;
  file!: any ;
  fileName: string = "";
  localUrl!: any;
  reconstruct_link!: any;
  split_link!: any;
  statusCode: any;
  jsonresult!: any;
  public loadObjFile() {
    var start = new Date().getTime();
    //create new file
    while (document.querySelectorAll('canvas').length != 0) {
      document.getElementsByTagName('canvas')[0].remove();
    }
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    var mtlLoader = new MaterialLoader();
    var camera = new THREE.PerspectiveCamera(17, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1620;
    camera.position.x = 100;
    camera.position.y = 50;


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(900, 570);
    document.body.appendChild(renderer.domElement);
    var can = document.querySelector('canvas');
    can!.style.position = 'absolute';
    can!.style.top = "95px";
    can!.style.left = "37%";


    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 85%)'), 1.0);
    keyLight.position.set(-50, 0, 100);
    scene.add(keyLight);

    var objLoader = new OBJLoader();
    //read file
    const fileReader = new FileReader();
    let fileString: string = "";
    fileReader.onloadend = () => {
      var reader = fileReader.result + "";
      fileString = reader;
      this.f = new File([reader], 'src.obj');
      const url = window.URL.createObjectURL(this.f);
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      objLoader.load(this.url.changingThisBreaksApplicationSecurity, function (object: any) {
        scene.add(object);
        object.position.y = 20;

      });
    }
    fileReader.readAsText(this.file)

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    console.log('Execution time');
    console.log(new Date().getTime() - start + ' ms');
    console.log('Size');
    console.log(document.getElementsByTagName('canvas')[0])
  }
  public loadObjFileFromAPI(link: any) {
    var start = new Date().getTime();
    //create new file
    while (document.querySelectorAll('canvas').length != 0) {
      document.getElementsByTagName('canvas')[0].remove();
    }
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f8f9);
    // var mtlLoader = new MaterialLoader();
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / 2 / window.innerHeight / 0.5, 1, 1000);
    camera.position.z = 420;
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(450, 450);
    document.body.appendChild(renderer.domElement);
    var can = document.querySelector('canvas');
    can!.style.position = 'absolute';
    can!.style.top = "100px";
    can!.style.left = "20%";


    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 82%)'), 1.0);
    keyLight.position.set(-50, 0, 100);
    scene.add(keyLight);

    var objLoader = new OBJLoader();
    objLoader.load(link, function (object: any) {
      scene.add(object);
    });


    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

  }
  handleClick() {
    const input = document.getElementById('file');
    input?.addEventListener('click', function fileChanged(event) {

    });
  }
  fileChanged(e: any) {
    this.file = e.target.files[0];
    this.fileName = this.file.name;
    this.localUrl = e.target.value;

    this.loadObjFile();
  }
  print() {
    this.service.print().subscribe(data => this.statusCode = data.code)
  }
  split(){
    this.loadObjFileFromAPI(this.split_link);

  }
  reconstruction(){
    if(this.file){
      const formData = new FormData();
      formData.append("obj",this.file);
      this.service.reconstruction(formData).subscribe(data => this.getresult(data))

    }
    else{
      this.statusCode = 10;
    }
}

  getresult(data: any)
  {
    this.reconstruct_link = data.reconstructed_face;
    this.split_link = data.split_wound;
    this.service.downloadFile(this.reconstruct_link).subscribe((response: any) => {
			let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			fileSaver.saveAs(blob, 'abc.obj');
			}), (error: any) => console.log('Error downloading the file'),
			() => console.info('File downloaded successfully');
    this.loadObjFileFromAPI(this.reconstruct_link);
  }




}
