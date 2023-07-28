/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Button, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { obterEntregas, deletarEntrega, salvarEntrega } from '../classes/Entrega';
import { Overlay } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';

function Historico() {

  const [resultado, setResultado] = useState([]);
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [latLog, setlatLong] = useState('');

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {

    obterEntregas().then((r) => { setResultado(r); }).catch(() => { setResultado([]); });

  }, [resultado]);

  function deletarEntregaPorId(id: number) {

    Alert.alert('Deletar', 'Você tem certeza que deseja deletar a entrega?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => deletarEntrega(id) },
    ]);

    obterEntregas().then((r) => { setResultado(r); }).catch(() => { setResultado([]); });
  }

  async function salvarEntregaManual(latlog, dthrEntrega){
      if (latlog !== ''){
        const latlongsplit = latLog.split(',');
        await salvarEntrega(Number(latlongsplit[0]), Number(latlongsplit[1]), dthrEntrega);
        toggleOverlay();
      }
  }

  function EstimativaDia(){
      let ultimoDiaEntrega = resultado[0].horario.slice(0, 10);

      let rsDia = resultado.filter(resultado => resultado.horario.slice(0, 10) == ultimoDiaEntrega)
      let qtEntregas = rsDia.length;
      let ganhos = 0;
      rsDia.forEach(i => {
        if(i.distancia < 0.4){
          ganhos += 4;
        }
        else if(i.distancia < 2.5){
          ganhos += 7;
        }
        else{
          ganhos += 10;
        }
      });
      return (<Text style={{ color: 'black', textAlign:'center', fontSize:16, fontWeight: 'bold', margin: 10 }}>{ultimoDiaEntrega} foram feitas {qtEntregas} entregas R$ {ganhos}</Text>);
    
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <ScrollView>
          <Button
            title="Adicionar Entrega"
            onPress={() => toggleOverlay()}
            style={overlayStyles.button}
          />
          {resultado.length > 0 ? <EstimativaDia/> : ''}
          {resultado.length > 0 ?  (
            resultado.map((i) => (
              <View key={i.id} style={{
                backgroundColor: '#ededed',
                borderColor: '#d9d9d9',
                borderRadius: 20,
                borderWidth: 1,
                margin: 5,
              }}>
                <View style={{ margin: 10 }}>
                  <Text style={{ color: 'black', fontSize: 20, fontWeight: '500' }}>{i.endereco}</Text>
                  <Text style={{ color: 'grey' }}>{i.horario} - {i.distancia}km</Text>
                  <Button color="darkred" title="Deletar" onPress={() => deletarEntregaPorId(i.id)} />
                </View>
              </View>))) :
            (
              <Text style={{ color: 'black', textAlign: 'center', fontSize: 20, marginTop: 30 }}>Histórico vázio</Text>
            )
          }
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <Text style={{color: 'black'}}>Latitude e Longitude:</Text>
          <TextInput style={ overlayStyles.input} placeholder="Exemplo: -23.9671426, -46.3317951" placeholderTextColor={'#d9d9d9'} onChangeText={newText => setlatLong(newText)}/>
          <DatePicker date={date} onDateChange={setDate} textColor="#000"/>
            <Button
              title="Salvar"
              onPress={() => salvarEntregaManual(latLog, date)}
            />
          </Overlay>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
const overlayStyles = StyleSheet.create({
  button: {
    margin: 10,
  },
  input: {
    width: 300,
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    color: 'black',
  },
});
export default Historico;
