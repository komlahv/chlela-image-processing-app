import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';
import AvatarEditor from 'react-avatar-editor';
import download from 'downloadjs';

import './editor.css';
import loading from '../../loading.gif';

import { toBase64 } from '../../shared/functions';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

const Editor: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [imageData, setImageData] = useState<string>('');
  const [framedImageData, setFramedImageData] = useState<string>('');

  const [canvas, setCanvas] = useState<AvatarEditor>();
  const [rotateDegree, setRotateDegree] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [canvasWidth, setCanvasWidth] = useState<number>(716);
  const [canvasHeight, setCanvasHeight] = useState<number>(559);
  const [canvasBorder, setCanvasBorder] = useState<number>(30);

  const PrepareCanvas = () => {
    const { innerWidth: width } = window;
    if (width < 716) {
      setCanvasWidth(250);
      setCanvasHeight(153);
      setCanvasBorder(10);
    }
  };

  const handleUpload = async (file: File) => {
    if (file) {
      PrepareCanvas();
      try {
        const base64Data: any = await toBase64(file);
        setImageData(base64Data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleClear = () => {
    setImageData('');
    setFramedImageData('');
    setScale(1.2);
    setRotateDegree(0);
  };

  const handleDownload = () => {
    download(framedImageData, 'framed-image.png', 'image/png');
  };

  const handlePublish = async () => {
    if (canvas) {
      setIsLoading(true);
      const canvasScaled = canvas.getImageScaledToCanvas();

      //Add frame on backend
      const base64Data: string = canvasScaled.toDataURL();
      const data: {} = {
        imageData: base64Data,
      };

      const res: Response = await fetch(
        'https://chlela-image-api.herokuapp.com/api/images',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const imageDataJson = await res.json();
      setFramedImageData(imageDataJson.imageData);
      setIsLoading(false);
    }
  };

  const setEditorRef = (editor: AvatarEditor) => setCanvas(editor);

  return (
    <>
      <div className="control">
        <div className="control-fields">
          <Input
            id="rotation"
            label="Rotate"
            type="number"
            value={rotateDegree}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRotateDegree(Number(e.target.value))
            }
          />

          <Input
            id="scale"
            label="Scale"
            type="number"
            value={scale}
            step={0.1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setScale(Number(e.target.value))
            }
          />
        </div>

        <div className="control-buttons">
          <Button onClick={handleClear} label="Clear" />
          <Button onClick={handlePublish} label="Publish" primary />
        </div>
      </div>

      <div className="preview">
        {isLoading && (
          <img
            src={loading}
            width={canvasWidth}
            height={canvasHeight}
            alt="loading"
          />
        )}

        {framedImageData && (
          <>
            <Button onClick={handleDownload} label="Download" primary />
            <img
              src={framedImageData}
              alt="output"
              width={canvasWidth}
              height={canvasHeight}
              style={{ display: 'inline-block', margin: '4px auto' }}
            />
          </>
        )}

        {imageData && !framedImageData && !isLoading && (
          <AvatarEditor
            ref={setEditorRef}
            image={imageData}
            width={canvasWidth}
            height={canvasHeight}
            border={canvasBorder}
            color={[0, 97, 254, 0.6]} // RGBA
            scale={scale}
            rotate={rotateDegree}
          />
        )}

        {!imageData && !framedImageData && (
          <ImageUploader
            withIcon={true}
            buttonText="Choose image"
            onChange={(file: File[]) => handleUpload(file[0])}
            imgExtension={['.jpg', '.png', '.gif']}
            maxFileSize={5242880}
            singleImage={true}
          />
        )}
      </div>
    </>
  );
};

export default Editor;
