import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as tf from '@tensorflow/tfjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'TfExample';
  fileToUpload: File;
  imgSrc: ImageData;
  model: tf.LayersModel;
  predictions: any;
  isLoading = true;
  predValue: string;
  @ViewChild('canvas', {static: true}) canvas: ElementRef;

  constructor() {

  }

  ngOnInit(): void {
    this.loadModel();
  }

  handleFile = (file: FileList) => {

    const fileTo = file[0];
    if (fileTo) {
      const reader = new FileReader();
      reader.readAsDataURL(fileTo);
      reader.onload = (res: any) => {
        this.imgSrc = res.target.result;
        const image = new Image();
        image.src = res.target.result;
        const cnvas: HTMLCanvasElement = this.canvas.nativeElement as HTMLCanvasElement;
        const cntxt: CanvasRenderingContext2D = cnvas.getContext('2d');
        cntxt.clearRect(0, 0, cnvas.width, cnvas.height);
        image.onload = () => {
          cntxt.drawImage(image, 0, 0);
          this.predict(this.canvas.nativeElement);
        };
      };
    }
  }

  loadModel = async () => {
    this.model = await tf.loadLayersModel('./assets/model.json');
    this.isLoading = false;
  }



  predict = (imageData: ImageData) => {

    const pred = tf.tidy(() => {
     let img = tf.browser.fromPixels(imageData, 3).resizeBilinear([150, 150]);
     img = img.expandDims(0);
     console.log(img.shape);
     img = tf.cast(img, 'float32');
     // Make and format the predications
     const output = this.model.predict(img) as any;
     // const perc = this.model.pro
     // Save predictions on the component
     this.predictions = Array.from(output.dataSync());
     // console.log(this.predictions);
     if (this.predictions[0] === 0) {
       this.predValue = 'Cat';
       // console.log('Cat');
     } else {
      this.predValue = 'Dog';
      // console.log('Dog');
     }
    });
  }
}
