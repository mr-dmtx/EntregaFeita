import React from 'react';
import { Text, View, PermissionsAndroid, Image } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {salvarEntrega} from '../classes/Entrega';
import { Button } from '@rneui/themed';

async function requestLocationPermission(){
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permissão de Localização',
        message: 'Este aplicativo precisa de permissão para acessar sua localização.',
        buttonNeutral: 'Perguntar depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Permissão de localização concedida
      getLocation();
    } else {
      // Permissão de localização negada
      console.log('Permissão de localização negada');
    }
  } catch (error) {
    console.warn(error);
  }
};

async function getLocation() {
  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      salvarEntrega(latitude, longitude);
    },
    (error) => {
      console.warn(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  );
};

function Principal(){
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          width: 240,
          height: 145,
          marginTop: 80
        }}
        source={require('../entregafeitafd2.png')}
      />
      <Button
        title="Entrega Feita"
        buttonStyle={{
          backgroundColor: '#1994FF',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 10,
        }}
        containerStyle={{
          width: 300,
          marginHorizontal: 50,
          marginVertical: 100,
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 30 }}
        onPress={() => requestLocationPermission()}/>

        <Text style={{
        color: 'black',
        fontSize: 20,
        marginTop: 150
      }} onPress={() => Linking.openURL('https://www.google.com/maps')}>
        <Icon name='map-marker' size={20}> </Icon>
          Abrir Google Maps
      </Text>
    </View>
  );
};


export default Principal;