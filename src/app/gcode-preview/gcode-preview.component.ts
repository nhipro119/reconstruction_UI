import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { WebGLPreview } from 'gcode-preview';
import * as THREE from 'three';
@Component({
  selector: 'app-gcode-preview',
  templateUrl: './gcode-preview.component.html',
  styleUrls: ['./gcode-preview.component.scss']
})
export class GcodePreviewComponent {
  chunkSize = 250;
  file: any;
  preview: any;
  private context!: HTMLCanvasElement;
  @Input() link = ''; // decorate the property with @Input()

  @ViewChild('myCanvas', { static: false }) canvas!: ElementRef;


  constructor(private http: HttpClient) {

  }
  ngAfterViewInit(): any {


    this.context = (this.canvas.nativeElement as HTMLCanvasElement);


    this.preview = new WebGLPreview({

      canvas: this.context,
      targetId: 'gcode-preview',
      topLayerColor: new THREE.Color('lime').getHex(),
      lastSegmentColor: new THREE.Color('red').getHex(),
      buildVolume: { x: 200, y: 250, z: 450, r: 100, i: 100, j: 100 },
      initialCameraPosition: [0, 1000, 900]
    });

    this.preview.render();
    // const linesList = this.fetchGcode("http://34.101.50.122:8010/get-gcode?gcode_file=affc7032-1d65-4044-8933-0d2db70b934c-00030d37-f0c3-11ed-9ad4-0242c0a8b002.gcode")
    // for (let index = 0; index < linesList.length; index++) {
    //   const element = linesList[index];
    //   this.loadPreviewChunked(this.preview, element, -99999999); // Load Preview

    // }

    let response: any;
    this.http.get(this.link, { responseType: 'text' }).subscribe(
      res => {
        response = res.split('\n');
        console.log(response)
      },
      err => console.log(err),
      () => {
        this.loadPreviewChunked(this.preview, response, -0.001); // Load Preview



      }

    )
    // this.loadPreviewChunked(this.preview, response, -99999999); // Load Preview

  }



  fetchGcode(url: any): string[] {
    // const response = await fetch(url);

    // if (response.status !== 200) {
    //   throw new Error(`status code: ${response.status}`);
    // }
    // console.log('res', response)
    // const file = await response.text();


    // return file.split('\n');
    let response: string[] = [];
    this.http.get(url, { responseType: 'text' }).subscribe(
      res => {

        response = res.toString().split('\n')
        console.log(res)
      },
      err => console.log(err),
      () => console.log('complete')
    )
    return response


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
