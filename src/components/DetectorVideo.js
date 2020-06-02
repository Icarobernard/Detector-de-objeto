
//Based on https://nanonets.com/blog/object-detection-tensorflow-js/
import React, { Component, Alert } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import translate from 'google-translate-open-api';


async function funcao() {
  const result = await translate(`I'm fine.`, {
    tld: "cn",
    to: "zh-CN",
  });
  const data = result.data[0];
  console.log(data);
}


class DetectorVideo extends Component {
  // reference to both the video and canvas
  videoRef = React.createRef();
  canvasRef = React.createRef();

  // we are gonna use inline style
  styles = {
    position: 'fixed',
    top: 250
  };


  detectFromVideoFrame = (model, video) => {
    model.detect(video).then(predictions => {
      this.showDetections(predictions);

      requestAnimationFrame(() => {
        this.detectFromVideoFrame(model, video);
      });
    }, (error) => {
      console.log("Couldn't start the webcam")
      console.error(error)
    });
  };

  showDetections = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const x = prediction.bbox[0] + 30;
      const y = prediction.bbox[1] + 50;
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // DESENHO DA CAIXA
      ctx.strokeStyle = "#47FCF3";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      // COR DOS LABELS
      ctx.fillStyle = "#47FCF3";
      let classified = prediction.class;




      if (prediction.class === "cell phone") {
        classified = "Celular";
      }

      if (prediction.class === "person") {
        classified = "pessoa";

      }

      if (prediction.class === "cat") {
        classified = "gato";
      }

      if (prediction.class === "apple") {
        classified = "maçã";
      }


      if (prediction.class === "dog") {
        classified = "cachorro";
      }


      const textWidth = ctx.measureText(classified).width;
      const textHeight = parseInt(font, 10);
      // DESENHA top left RETANGULO
      ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
      // draw bottom left rectangle
      ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(classified, x, y);
      ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
  };

  componentDidMount() {
    if (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia) {
      // define a Promise that'll be used to load the webcam and read its frames
      const webcamPromise = navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then(stream => {
          // pass the current frame to the window.stream
          window.stream = stream;
          // pass the stream to the videoRef
          this.videoRef.current.srcObject = stream;

          return new Promise(resolve => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        }, (error) => {
          console.log("Couldn't start the webcam")
          console.error(error)
        });

      // define a Promise that'll be used to load the model
      const loadlModelPromise = cocoSsd.load();

      // resolve all the Promises
      Promise.all([loadlModelPromise, webcamPromise])
        .then(values => {
          this.detectFromVideoFrame(values[0], this.videoRef.current);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  // here we are returning the video frame and canvas to draw,
  // so we are in someway drawing our video "on the go"
  render() {
    return (
      <>
        <video
          style={this.styles}
          autoPlay
          muted
          ref={this.videoRef}
          width="720"
          height="600"
        />
        <canvas style={this.styles} ref={this.canvasRef} width="720" height="650" />
      </>
    );
  }
}

export default DetectorVideo;