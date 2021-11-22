import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import firebase from '../../firebase/config';
import { useSelector } from 'react-redux';

export default function CommentsScreen({ route }) {
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [isShownKeyboard, setIsShownKeyBoard] = useState(false);
  const { postId } = route.params;
  const { username } = useSelector((state) => state.auth);

  useEffect(() => {
    getComments();
  }, [message]);

  const createComment = async () => {
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add({ message, username });
    setIsShownKeyBoard(false);
    Keyboard.dismiss();
    setMessage('');
  };

  async function getComments() {
    firebase
      .firestore()
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .onSnapshot((data) =>
        setComments(data.docs.map((item) => ({ ...item.data(), id: item.id })))
      );
  }

  const onBackdropTap = () => {
    setIsShownKeyBoard(false);
    Keyboard.dismiss();
  };

  return (
    <View
      style={{
        ...styles.container,
        marginBottom: isShownKeyboard ? 20 : 160,
      }}
      onPress={onBackdropTap}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.listContainer}
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentsContainer}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.comment}>{item.message}</Text>
            </View>
          )}
        />
      </SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            style={styles.input}
            placeholder="Comment text..."
            onChangeText={setMessage}
            clearButtonMode="always"
          />
          <TouchableOpacity
            style={styles.postBtn}
            activeOpacity={0.4}
            onPress={createComment}
          >
            <Text style={styles.snapTitle}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  listContainer: {
    paddingTop: 10,
  },
  commentsContainer: {
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#ededed',
    shadowOffset: {
      width: 1,
      height: 6,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  username: {
    fontStyle: 'italic',
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
  },
  comment: {
    marginTop: 5,
    color: '#66364e',
    fontFamily: 'Raleway-Regular',
  },
  inputWrapper: {
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
  input: {
    height: 50,
    width: 300,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomColor: '#b00b6970',
  },
  snapTitle: {
    color: '#000',
  },
});
