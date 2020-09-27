import React from 'react';
import Editor from './containers/Editor/Editor';
import { Header } from './components/Header/Header';

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Editor />
    </div>
  );
};

export default App;
