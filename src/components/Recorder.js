import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import Voice from '@react-native-community/voice';
import {store} from '../../redux/store';

const Recorder = () => {
  const dispatch = useDispatch();
  const animal = useSelector((state) => state.animal);
  console.log(animal);
  const [state, setState] = useState({
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
  });

  useEffect(() => {
    const onSpeechStart = (e) => {
      console.log('onSpeechStart: ', e);
      setState({
        started: '√',
      });
    };

    const onSpeechRecognized = (e) => {
      console.log('onSpeechRecognized: ', e);
      setState({
        recognized: '√',
      });
    };

    const onSpeechEnd = (e) => {
      console.log('onSpeechEnd: ', e);
      setState({
        end: '√',
      });
    };

    const onSpeechError = (e) => {
      console.log('onSpeechError: ', e);
      setState({
        error: JSON.stringify(e.error),
      });
    };

    const onSpeechResults = (e) => {
      console.log('onSpeechResults: ', e);
      if (e.value.includes('cat')) {
        store.dispatch({type: 'CAT'});
      } else if (e.value.includes('dog')) {
        store.dispatch({type: 'DOG'});
      }
      setState({
        results: e.value,
      });
    };

    const onSpeechPartialResults = (e) => {
      console.log('onSpeechPartialResults: ', e);

      setState({
        partialResults: e.value,
      });
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechVolumeChanged = (e) => {
    console.log('onSpeechVolumeChanged: ', e);
    setState({
      pitch: e.value,
    });
  };

  const _startRecognizing = async () => {
    setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
    dispatch({type: 'RESET'});
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
    dispatch({type: 'RESET'});
  };

  const WebViewRenderer = ({url}) => {
    if (animal === 'cat') {
      return (
        <View style={{height: 150, width: 150, overflow: 'hidden'}}>
          <WebView
            source={{uri: 'https://www.youtube.com/embed/ByH9LuSILxU'}}
            scalesPageToFit={true}
          />
        </View>
      );
    }
    if (animal === 'dog') {
      return (
        <View style={{height: 150, width: 150, overflow: 'hidden'}}>
          <WebView
            source={{uri: 'https://www.youtube.com/embed/wtH-hdOF1uA'}}
            scalesPageToFit={true}
          />
        </View>
      );
    } else {
      return <Text>Please Speak to load video</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <WebViewRenderer />
      <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
      <Text style={styles.instructions}>
        Press the button and start speaking.
      </Text>
      <Text style={styles.stat}>{`Started: ${state.started}`}</Text>
      <Text style={styles.stat}>{`Recognized: ${state.recognized}`}</Text>
      <Text style={styles.stat}>{`Pitch: ${state.pitch}`}</Text>
      <Text style={styles.stat}>{`Error: ${state.error}`}</Text>
      <Text style={styles.stat}>Results</Text>
      {state.results
        ? state.results.map((result, index) => {
            return (
              <Text key={`result-${index}`} style={styles.stat}>
                {result}
              </Text>
            );
          })
        : null}
      <Text style={styles.stat}>Partial Results</Text>
      {state.partialResults
        ? state.partialResults.map((result, index) => {
            return (
              <Text key={`partial-result-${index}`} style={styles.stat}>
                {result}
              </Text>
            );
          })
        : null}
      <Text style={styles.stat}>{`End: ${state.end}`}</Text>
      <TouchableHighlight onPress={_startRecognizing}>
        <Image style={styles.button} source={require('./button.png')} />
      </TouchableHighlight>
      <TouchableHighlight onPress={_stopRecognizing}>
        <Text style={styles.action}>Stop Recognizing</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={_cancelRecognizing}>
        <Text style={styles.action}>Cancel</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={_destroyRecognizer}>
        <Text style={styles.action}>Destroy</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
});

export default Recorder;
