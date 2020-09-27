import React, { useState } from 'react';
import Jimp from 'jimp';
import logo from '../../logo.svg';
import './editor.css';

import Button from '../../components/Button/Button';

const Editor: React.FC = () => {
  const [imageData, setImageData] = useState<string>('');
  const [imageDataTemp, setImageDataTemp] = useState<string>('');
  const [MIMEType, setMIMEType] = useState<string>('');
  const [rotateDegree, setRotateDegree] = useState<number>(0);
  const [xSize, setXSize] = useState<number>(0);
  const [ySize, setYSize] = useState<number>(0);

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
      try {
        const base64Data: any = await toBase64(file);
        const base64DataTrim = base64Data.replace(
          /^data:image\/\w+;base64,/,
          ''
        );
        setImageDataTemp(base64DataTrim);
        const image: Jimp = await Jimp.read(
          Buffer.from(base64DataTrim, 'base64')
        );
        setXSize(image.bitmap.width);
        setYSize(image.bitmap.height);
        const preview: string = await image.getBase64Async('image/png');
        setImageData(preview);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleEdit = async () => {
    if (imageData) {
      try {
        const image: Jimp = await Jimp.read(
          Buffer.from(imageDataTemp, 'base64')
        );
        image.resize(xSize, ySize);
        image.rotate(rotateDegree);
        const preview: string = await image.getBase64Async('image/png');
        setImageData(preview);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleClear = () => setImageData('');

  return (
    <>
      <div className="control">
        <div className="control-fields">
          <label htmlFor="rotation"> Rotate </label>
          <input
            id="rotation"
            type="number"
            value={rotateDegree}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRotateDegree(Number(e.target.value))
            }
          />

          <div>
            Size:
            <label htmlFor="xSize"> x </label>
            <input
              id="xSize"
              type="number"
              value={xSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setXSize(Number(e.target.value))
              }
            />
            <label htmlFor="ySize"> y </label>
            <input
              id="ySize"
              type="number"
              value={ySize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setYSize(Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="control-buttons">
          <Button onClick={handleEdit} label="Apply" />
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
          <img src={imageData} alt="output" style={{ maxWidth: '100vw' }} />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement> | any) =>
              handleUpload(e.target.files[0])
            }
          />
        )}
      </div>
    </>
  );
};

export default Editor;
