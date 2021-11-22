import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { authStateChangeUser } from '../redux/auth/authOperations';
import useRoute from '../services/router';

export default function Main() {
  const { isAuth } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const routing = useRoute(isAuth);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  return <NavigationContainer>{routing}</NavigationContainer>;
}
