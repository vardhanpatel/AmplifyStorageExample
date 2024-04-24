import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { uploadData } from 'aws-amplify/storage';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const App = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilename(selectedFile.name);
    // Clear image URL if not an image
    if (!selectedFile.type.startsWith('image/')) {
      setImageUrl('');
    }
  };

  const handleUpload = async () => {
    try {
      const result = await uploadData({
        key: filename,
        data: file,
        options: {
          accessLevel: 'guest',
          onProgress: (progressEvent) => {
            const progressPercent = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            setProgress(progressPercent);
          }
        }
      });
      console.log('Succeeded: ', result);
      // If the uploaded file is an image, set imageUrl to display it
      if (file.type.startsWith('image/')) {
        setImageUrl(URL.createObjectURL(file));
      }
      // You can add further handling here, such as updating state or displaying a success message.
    } catch (error) {
      console.log('Error : ', error);
      // You can handle errors here, such as displaying an error message to the user.
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{ textAlign: 'center' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </header>
          <main>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} style={{ display: 'block', margin: '20px auto' }}>Upload</button>
            {progress > 0 && <p>Progress: {progress}%</p>}
            {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />}
          </main>
        </div>
      )}
    </Authenticator>
  );
};

export default App;
