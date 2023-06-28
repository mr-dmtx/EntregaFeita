import React, {useEffect, useState} from 'react';
import { Text, View, Alert, Button, SafeAreaView } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { obterEntregas, deletarEntrega } from '../classes/Entrega';

function Historico(){
  
  const [resultado, setResultado] = useState([]);
  
  useEffect(() => {

    obterEntregas().then((r) => {setResultado(r)}).catch(() => {setResultado([])});
    
  }, [resultado]);
  
  function deletarEntregaPorId(id:number){

    Alert.alert('Deletar', 'Você tem certeza que deseja deletar a entrega?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deletarEntrega(id)},
    ]);

    obterEntregas().then((r) => {setResultado(r)}).catch(() => {setResultado([])});
  }

  return (
    <GestureHandlerRootView>
    <SafeAreaView>
      <ScrollView>
        { resultado.length > 0 ? ( 
          resultado.map((i) => (
            <View key={i.id} style={{
              backgroundColor: '#ededed',
              borderColor: '#d9d9d9',
              borderRadius: 20,
              borderWidth: 1,
              margin: 5
              }}>
              <View style={{ margin: 10 }}>
                <Text style={{color: 'black', fontSize: 20, fontWeight: '500'}}>{i.endereco}</Text>
                <Text style={{color: 'grey'}}>{i.horario} - {i.distancia}km</Text>
                <Button color='darkred' title='Deletar' onPress={() => deletarEntregaPorId(i.id)}/>
              </View>
          </View> ))) : 
          (
            <Text style={{color: 'black', textAlign:'center', fontSize: 20, marginTop: 30}}>Histórico vázio</Text>
          )
        }
      </ScrollView>
      </SafeAreaView>
      </GestureHandlerRootView>
    );
}
export default Historico;