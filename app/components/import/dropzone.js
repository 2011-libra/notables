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
    accept: 'text/markdown',
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
          <p>Drop or Select .md files here!</p>
        </div>
        <div>
          <aside>
            <h4>My Files:</h4>
            <ul>{files}</ul>
          </aside>
        </div>
      </div>
      {/* <Texteditor result={result} /> */}
    </>
  );
}
