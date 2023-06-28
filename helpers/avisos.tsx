import { Alert } from 'react-native';

export function AlertPergunta(title:string, text:string){

  let result = true;
  Alert.alert(title, text, [
    {
      text: 'Não',
      onPress: () => result = false
    },
    {
      text: 'SIM', 
      onPress: () => result = true
    },
  ]);
  console.log(result);
  return result;
}

export function Aviso(title:string, text:string){
  Alert.alert(title, text);
}
