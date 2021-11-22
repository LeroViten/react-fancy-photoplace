import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import firebase from '../../firebase/config';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DefaultScreen({ navigation, route }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    firebase
      .firestore()
      .collection('posts')
      .onSnapshot((data) =>
        setPosts(data.docs.map((item) => ({ ...item.data(), id: item.id })))
      );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postImgWrapper}>
            <Image source={{ uri: item.photo }} style={styles.postImg} />
            <Text style={styles.postMessage}>{item.message}</Text>
            <View style={styles.postBtnWrapper}>
              <TouchableOpacity
                style={styles.nestedLink}
                activeOpacity={0.4}
                onPress={() =>
                  navigation.navigate('Comments', { postId: item.id })
                }
              >
                <Icon
                  name="chatbubble-ellipses"
                  style={styles.actionButtonIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nestedLink}
                activeOpacity={0.4}
                onPress={() =>
                  navigation.navigate('Map', { location: item.location })
                }
              >
                <Icon name="location" style={styles.actionButtonIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImgWrapper: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#dedede',
  },
  postImg: {
    height: 200,
    width: 350,
    borderRadius: 5,
  },
  postMessage: {
    fontSize: 16,
    marginTop: 10,
  },
  nestedLink: {
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 5,
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 30,
    height: 32,
    color: '#b0b0b0',
  },
  postBtnWrapper: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
