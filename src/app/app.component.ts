import { LoaderService } from './loader.service';


import { HttpClient } from '@angular/common/http';
import { Component,ElementRef, ViewChild, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MaterialLoader } from 'three';
import { PrintingService } from './printing.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { WebGLPreview } from 'gcode-preview';
import {MatGridListModule} from '@angular/material/grid-list';
import { time } from 'console';
import { Subject } from 'rxjs';
// import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
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
  formData!: FormData;
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
  chunkSize = 250;
  preview: any;
  reconstruct_file!:any;
  split_file!:any;
  printer_config!:any;
  extruder_config!:any;
  current_link!:any;
  curren_filename!:any;
  percent:number = 0;
  url_uploadfile:any = "none";
  id_gcode!:any;
  url_gcode!:any;
  isIntended:boolean = false;
  file_gcode: any;
  success_printing:boolean = false;
  gcode_file: any;

  private context!: HTMLCanvasElement;
  @Input() link = ''; // decorate the property with @Input()

  @ViewChild('myCanvas', { static: false }) canvas!: ElementRef;





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
    camera.position.x = 1000;
    camera.position.y = 500;


    var renderer = new THREE.WebGLRenderer();
    // renderer.domElement.style.position = "initial";
    renderer.domElement.style.top = "0px";
    renderer.setSize(1500, 850);
    var div:any = document.getElementById('myObject');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    document.getElementById("myObject")?.appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
    var can = document.querySelector('canvas');
    can!.style.position = 'initial';
    can!.style.top = "0px";


    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 85%)'), 1.0);
    keyLight.position.set(-50, 0, 100);
    scene.add(keyLight);

    var objLoader = new OBJLoader();
    //read file
    var fileReader = new FileReader();
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
    renderer.setSize(1500, 850);
    document.getElementById("myObject")?.appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
    var can = document.querySelector('canvas');
    can!.style.position = 'initial';
    // can!.style.top = "100px";
    // can!.style.left = "20%";


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
    this.service.print().subscribe(data => this.message())
  }
  message(){
    this.success_printing = true;
  }
  split(){
    this.loadObjFileFromAPI(this.split_link);
    this.service.downloadFile(this.split_link).subscribe((Response: any) =>
    {
      let split_name = this.fileName.replace(".obj","_split.obj");
      this.split_file = new File([Response],split_name);
      this.file = this.split_file;
      this.curren_filename = split_name;
      this.current_link = this.split_link;
    })

  }
  reconstruction(){
    if(this.file){
      const formData = new FormData();
      formData.append("obj",this.file);
      this.service.reconstruction(formData).subscribe(data => this.getresult(data));



    }

}

  getresult(data: any)
  {
    this.reconstruct_link = data.reconstructed_face;
    this.split_link = data.split_wound;
    this.service.downloadFile(this.reconstruct_link).subscribe((response: any) => {
      this.curren_filename = this.fileName.replace(".obj","_reconstruction.obj");
      // let blobf:Blob = new Blob([response],{type:"aplication/obj"})
			this.reconstruct_file = new File([response],this.curren_filename);
      this.file = this.reconstruct_file;
      this.current_link = this.reconstruct_link;

    }, (error: any) => console.log('Error downloading the file'),
    () => console.info('File downloaded successfully'));
			// const url = window.URL.createObjectURL(blob);
			// //window.open(url);
			// fileSaver.saveAs(blob, 'abc.obj');
			// }), (error: any) => console.log('Error downloading the file'),
			// () => console.info('File downloaded successfully');

    // this.loadObjFile();
    this.loadObjFileFromAPI(this.reconstruct_link);
  }

  config_file(e:any){
    this.printer_config = e.target.files[0];
  }
  downloadfile()
  {
      this.service.downloadFile(this.current_link).subscribe((response: any)=>{

      let blob:Blob = new Blob([response],{type:"text/obj"});
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
			fileSaver.saveAs(blob, this.curren_filename);
			}), (error: any) => console.log('Error downloading the file'),
			() => console.info('File downloaded successfully');

  }
  get_config(){
    const input = document.getElementById('config');
    input?.addEventListener('click', function config_file(event) {

    });
  }
  upload()
  {
    let fformData: FormData = new FormData();
    fformData.append("uploads", this.file);
    fformData.append("projectId","ae40c722-e595-11ed-865a-42010ab80002");
    fformData.append("folderId", "6f2abba6-e743-11ed-96d1-42010ab80002");
    this.service.upload(fformData).subscribe(data => this.slice(data));
  }
  slice(data:any){
    let formslice:FormData = new FormData();

    this.url_uploadfile = data.data[0].url;
    formslice.append("model",this.url_uploadfile);
    formslice.append("quality","normal");
    formslice.append("filament","PLA");
    formslice.append("folderId","6f2abba6-e743-11ed-96d1-42010ab80002");
    formslice.append("projectId","ae40c722-e595-11ed-865a-42010ab80002");
    this.service.slice_service(formslice).subscribe(data => {
      this.id_gcode = data.id;
      this.url_gcode = data.data;
      console.log(this.id_gcode);

    },
    err=>{},
    ()=>this.isIntended=!this.isIntended)
  }

}
