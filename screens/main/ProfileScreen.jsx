import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { authSignOutUser } from '../../redux/auth/authOperations';
import firebase from '../../firebase/config';

export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    getPersonalPosts();
  }, []);
  const getPersonalPosts = async () => {
    await firebase
      .firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .onSnapshot((data) =>
        setPosts(data.docs.map((item) => ({ ...item.data(), id: item.id })))
      );
  };

  const handleSingOutClick = () => {
    dispatch(authSignOutUser());
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logOutWrapper}>
          <TouchableOpacity
            style={styles.logOutLink}
            activeOpacity={0.4}
            onPress={handleSingOutClick}
          >
            <Icon name="log-out" style={styles.actionButtonIcon} />
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.listContainer}
          data={posts}
          keyExtractor={(item) => item.id}
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: 10,
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
  logOutWrapper: {
    marginLeft: 'auto',
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
  logOutLink: {
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
});
