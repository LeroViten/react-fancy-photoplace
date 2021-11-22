import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authSignInUser } from '../../redux/auth/authOperations';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

const initialState = {
  email: '',
  password: '',
};

export default function LoginScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [isShownKeyboard, setIsShownKeyBoard] = useState(false);
  const [dimensions, setDimensions] = useState(
    Dimensions.get('window').width - 20 * 2
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const onScreenRotate = () => {
      const width = Dimensions.get('window').width - 20 * 2;
      setDimensions(width);
    };
    Dimensions.addEventListener('change', onScreenRotate);

    return () => {
      Dimensions.removeEventListener('change', onScreenRotate);
    };
  }, []);

  const onSubmit = () => {
    setIsShownKeyBoard(false);
    Keyboard.dismiss();
    dispatch(authSignInUser(state));
    setState(initialState);
  };

  const onBackdropTap = () => {
    setIsShownKeyBoard(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={onBackdropTap}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.bgImage}
          source={require('../../assets/images/bgImg.jpg')}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' && 'padding'}>
            <View
              style={{
                ...styles.form,
                marginBottom: isShownKeyboard ? 20 : 200,
                width: dimensions,
              }}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Welcome Back</Text>
                <Text style={styles.headerTitle}>Login to continue</Text>
              </View>
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.emailTitle}>Your Email</Text>
                <TextInput
                  style={styles.input}
                  textAlign={'center'}
                  keyboardType="email-address"
                  value={state.email}
                  clearButtonMode="always"
                  onFocus={() => setIsShownKeyBoard(true)}
                  onChangeText={(value) =>
                    setState((prev) => ({ ...prev, email: value }))
                  }
                />
              </View>
              <View>
                <Text style={styles.passwordTitle}>Your Password</Text>
                <TextInput
                  style={styles.input}
                  textAlign={'center'}
                  secureTextEntry={true}
                  value={state.password}
                  clearButtonMode="always"
                  onFocus={() => setIsShownKeyBoard(true)}
                  onChangeText={(value) =>
                    setState((prev) => ({ ...prev, password: value }))
                  }
                />
              </View>
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.6}
                onPress={onSubmit}
              >
                <Text style={styles.submitBtnTitle}>SUBMIT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.authQueryBtn}
                activeOpacity={0.6}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.authQueryTitle}>
                  New here? Click to register
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 100,
  },
  headerTitle: {
    color: '#420528',
    fontFamily: 'Raleway-Bold',
    fontSize: 30,
  },
  form: {
    // marginHorizontal: 40,
  },
  emailTitle: {
    color: '#420528',
    marginBottom: 5,
    fontFamily: 'Raleway-Regular',
    fontSize: 18,
  },
  passwordTitle: {
    color: '#420528',
    marginBottom: 5,
    fontFamily: 'Raleway-Regular',
    fontSize: 18,
  },
  input: {
    borderWidth: 2,
    borderColor: '#895d9c',
    borderRadius: 5,
    height: 50,
  },
  submitBtn: {
    height: 50,
    marginTop: 40,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderColor: '#895d9c',
    ...Platform.select({
      ios: {
        backgroundColor: 'transparent',
      },
      android: {
        backgroundColor: '#E9D6F0',
      },
    }),
  },
  submitBtnTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 20,
    color: '#403645',
  },
  authQueryTitle: {
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    color: '#403645',
  },
  authQueryBtn: {
    height: 35,
    marginTop: 20,
    marginHorizontal: 40,
    backgroundColor: '#f794c6',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#895d9c',
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
  },
});
