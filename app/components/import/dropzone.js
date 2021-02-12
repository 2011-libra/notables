import React, { useEffect, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import Texteditor from '../texteditor/texteditor';
import './Dropzone.css';
import { getImport } from '../../redux/import';

export default function dropzone() {
  const [result, setResult] = useState('');

  let importState = useSelector(state => state);

  const dispatch = useDispatch();

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        //Action with file contents here:
        const fileContents = reader.result;
        //Setting state to our imported result
        // setResult(fileContents);
        dispatch(getImport(fileContents));
      };
      //Attach methods here onto reader
      reader.readAsText(file);
    });
  }, []);

  //Initialize dropzone:
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: '.md, .txt',
    onDrop
  });
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const files = acceptedFiles.map((file, idx) => {
    return (
      <ul key={file.path + '-detail'}>
        <li key="uploaded" style={{fontWeight: "bold", color: "gray"}}>
          File has been uploaded:
        </li>
        <li key="file-name">
          {file.path}
        </li>
        <li key="file-size" style={{fontSize: "10px", color: "gray"}}>
          {file.size} bytes
        </li>
        <li key="time-stamp" style={{fontSize: "10px", color: "gray"}}>
          {today.toLocaleString()}
        </li>
      </ul>
    );
  });

  return (
    <>
      <div className="dropzone_container">
        <div {...getRootProps({ className: 'dropzone_drop' })}>
          <input {...getInputProps()} />
          <p>DROP or SELECT</p>
          <p>a file (.md)</p>
        </div>
        <div>
          <aside>
            <h4></h4>
            <div>{files}</div>
          </aside>
        </div>
      </div>
      {/* <Texteditor result={result} /> */}
    </>
  );
}
