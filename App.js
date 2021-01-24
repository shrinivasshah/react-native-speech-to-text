import React from 'react';
import {View, Text} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import Recorder from './src/components/Recorder';

const App = () => {
  return (
    <Provider store={store}>
      <Recorder />
    </Provider>
  );
};

export default App;
