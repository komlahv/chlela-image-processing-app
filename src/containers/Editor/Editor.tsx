import React, { useState } from 'react';
import Jimp from 'jimp';
import ImageUploader from 'react-images-upload';
import AvatarEditor from 'react-avatar-editor';
import './editor.css';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

const Editor: React.FC = () => {
  const [imageData, setImageData] = useState<any>('');
  const [imageDataTemp, setImageDataTemp] = useState<string>('');
  const [MIMEType, setMIMEType] = useState<string>('');
  const [rotateDegree, setRotateDegree] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [canvasWidth, setCanvasWidth] = useState<number>(716);
  const [canvaseHeight, setCanvaseHeight] = useState<number>(559);
  const [canvaBorder, setCanvasBorder] = useState<number>(30);

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = async (file: File) => {
    if (file) {
      setMIMEType(file.type);
      const { innerWidth: width } = window;
      if (width < 716) {
        setCanvasWidth(250);
        setCanvaseHeight(153);
        setCanvasBorder(10);
      }

      try {
        const base64Data: any = await toBase64(file);
        const base64DataTrim = base64Data.replace(
          /^data:image\/\w+;base64,/,
          ''
        );
        setImageDataTemp(base64DataTrim);
        setImageData(base64Data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleClear = () => {
    setImageData('');
    setScale(1.2);
    setRotateDegree(0);
  };

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
            id="xSize"
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
          <Button
            onClick={handleClear}
            label="Publish"
            primary
            disabled={true}
          />
        </div>
      </div>
      <div className="preview">
        {imageData ? (
          <AvatarEditor
            image={imageData}
            width={canvasWidth}
            height={canvaseHeight}
            border={canvaBorder}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={scale}
            rotate={rotateDegree}
          />
        ) : (
          <ImageUploader
            withIcon={true}
            buttonText="Choose image"
            onChange={(file: any[]) => handleUpload(file[0])}
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
