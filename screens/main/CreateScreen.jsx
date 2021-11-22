import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { storage } from '../../firebase/config';
import firebase from '../../firebase/config';

export default function CreateScreen({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [errorMsg, setErrorMsg] = useState(null);

  const { userId, username } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locationResponse = await Location.getCurrentPositionAsync({});
      setLocation(locationResponse);
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePhoto = async () => {
    const options = { quality: 0.5 }; // other default props: base64: false, exif: false
    if (camera) {
      const snap = await camera.takePictureAsync(options);
      setPhoto(snap.uri);
    }
  };

  const sendPhoto = () => {
    uploadPostData();
    navigation.navigate('DefaultScreen');
    setPhoto(null);
    setMessage('');
  };

  const uploadPostData = async () => {
    const metadata = {
      contentType: 'image/jpeg',
    };
    const uri = Platform.OS === 'ios' ? photo.replace('file://', '') : uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileId = Date.now().toString();
    const extension = photo.split('.').pop();
    const fileName = `${fileId}.${extension}`;
    const storageRef = firebase.storage().ref(`postImages/${fileName}`);
    storageRef
      .put(blob, metadata)
      .then((snapshot) => {
        console.log('Photo was uploaded!');
      })
      .then(() => {
        storageRef
          .getDownloadURL()
          .then((response) => {
            console.log('Got post photo link!');
            firebase.firestore().collection('posts').add({
              userId,
              username,
              photo: response,
              message,
              location: location.coords,
              id: Date.now().toString(),
              date: new Date(),
            });
            console.log('Post data uploaded to database');
          })
          .catch((error) =>
            console.log('Shit happened while uploading post data')
          );
      })
      .catch((error) => {
        console.error(error);
        alert('Something went wrong');
      });
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={(ref) => setCamera(ref)} type={type}>
        {photo ? (
          <View style={styles.previewContainer}>
            <Image style={styles.previewImg} source={{ uri: photo }} />
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.snapType}
          activeOpacity={0.4}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.snapTitle}> FLIP </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.snapButton}
          activeOpacity={0.4}
          onPress={takePhoto}
        >
          <Text style={styles.snapTitle}>SNAP</Text>
        </TouchableOpacity>
      </Camera>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          style={styles.input}
          placeholder="Description"
          onChangeText={setMessage}
          clearButtonMode="always"
        />
      </View>
      <View style={styles.postContainer}>
        <TouchableOpacity
          style={styles.postBtn}
          activeOpacity={0.4}
          onPress={sendPhoto}
        >
          <Text style={styles.snapTitle}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  snapButton: {
    marginBottom: 30,
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#ffffff60',
    borderRadius: 80 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapType: {
    marginBottom: 30,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#ffffff50',
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapTitle: {
    color: '#000',
  },
  previewContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderColor: '#b00b69',
    borderWidth: 2,
    height: 204,
    width: 204,
  },
  previewImg: {
    height: 200,
    width: 200,
  },
  postContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  postBtn: {
    marginBottom: 10,
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: '#b00b69',
    backgroundColor: '#b00b6960',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginHorizontal: 10,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomColor: '#b00b6970',
  },
});
