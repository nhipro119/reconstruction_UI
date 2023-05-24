import { LoaderService } from './loader.service';


import { HttpClient } from '@angular/common/http';
import { Component,ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MaterialLoader } from 'three';
import { PrintingService } from './printing.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { WebGLPreview } from 'gcode-preview';
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
  private context!: HTMLCanvasElement;
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
    this.service.downloadFile(this.split_link).subscribe((Response: any) =>
    {
      let split_name = this.fileName.replace(".obj","_split.obj");
      this.split_file = new File([Response],split_name);
      this.file = this.split_file;
      this.statusCode = split_name;
    })

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
      // let blobf:Blob = new Blob([response],{type:"aplication/obj"})
			this.reconstruct_file = new File([response],"abc.obj");
      this.file = this.reconstruct_file;
      this.statusCode = this.file.name;
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
  get_config(){
    const input = document.getElementById('config');
    input?.addEventListener('click', function config_file(event) {

    });
  }
  slice()
  {
    let fformData: FormData = new FormData();
    fformData.append("model", this.file);
    fformData.append("printer_config",this.printer_config);
    fformData.append("extruder_config", this.extruder_config);
    this.service.slice_service(fformData).subscribe(data => this.setup_gcode_view(data.data));
  }
  setup_gcode_view(url:any){
    this.context = (this.canvas.nativeElement as HTMLCanvasElement);

    this.preview = new WebGLPreview({
      canvas: this.context,
      targetId: 'gcode-preview',
      topLayerColor: new THREE.Color('lime').getHex(),
      lastSegmentColor: new THREE.Color('red').getHex(),
      buildVolume: { x: 450, y: 410, z: 350, r: 100, i: 100, j: 100 },
      initialCameraPosition: [0, 400, 450]
    });

    this.preview.render();
    this.statusCode = url;
    this.dropped(url);
  }
  dropped(files: any): any {
    for (const droppedFile of files) {
      // if (droppedFile.fileEntry.isFile && droppedFile.relativePath !== undefined)
      {
        // const fileEntry = droppedFile.fileEntry as FileSystemFileEntry; // cast droppedFile to FileEntry
        // fileEntry.file(async (file: File) =>
        {
          // const url = window.URL.createObjectURL(file); // createUrl To The FileEntry
          const url = "http://34.101.50.122:8010/get-gcode?gcode_file=HUU_6318_6.gcode";
          const linesList = this.fetchGcode(url); // get List Of Line of the current File
          this.loadPreviewChunked(this.preview, linesList, 50); // Load Preview
        };
      }

    }


  }

  async fetchGcode(url: any): Promise<any> {
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error(`status code: ${response.status}`);
    }
    const file = await response.text();
    return file.split('\n');
  }


  loadPreviewChunked(target: any, lines: any, delay: any): any {
    let c = 0;
    const id = '__animationTimer__' + Math.random().toString(36).substring(2, 9);

    console.log('id', id);
    console.log(typeof id);
    const loadProgressive = () => {
      const start = c * this.chunkSize;
      const end = (c + 1) * this.chunkSize;
      const chunk = lines.slice(start, end);
      target.processGCode(chunk);
      c++;
      if (c * this.chunkSize < lines.length) {
        // window[id] = setTimeout(loadProgressive, delay);
        setTimeout(loadProgressive, delay);
      }
      else {
        console.log('this file was complete');
      }
    };


    // window.clearTimeout(window[id]);
    clearTimeout(setTimeout(loadProgressive, delay));
    loadProgressive();
  }


}
