import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Texteditor from '../texteditor/texteditor';
import './Dropzone.css';

export default function dropzone() {
  const [result, setResult] = useState({});

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        //Action with file contents here:
        const fileContents = reader.result;
        //Setting state to our imported result
        setResult(fileContents);
      };
      //Attach methods here onto reader
      reader.readAsText(file);
    });
  }, []);

  //Initialize dropzone:
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'text/plain',
    onDrop
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <div className="dropzone_container">
        <div {...getRootProps({ className: 'dropzone_drop' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </div>
      <Texteditor result={result} />
    </>
  );
}
