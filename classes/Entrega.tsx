import { Alert } from "react-native";
import axios from "axios";
import { db } from './Database';

  export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em quilômetros

    return Number(distancia.toFixed(2));
  }

  export function toRad(valor: number) {
    return valor * Math.PI / 180;
  }

  export async function  obterEndereco(lat : number, lon : number) {

    const apiKey = 'your-api-key';
    const url = `https://dev.virtualearth.net/REST/v1/Locations/${lat},${lon}?o=json&key=${apiKey}`;

    try {

      const response = await axios.get(url);
      let endereco = await response.data.resourceSets[0].resources[0].address.addressLine;

      return endereco;

    } catch (error) {

      console.error('Erro ao obter o endereço:', error);

      return null;

    }
  }

  export async function salvarEntrega(lat: number, lon: number) {
    const distancia = calcularDistancia(lat, lon, -23.9671426, -46.3317951); //lat e lon pasteluxo
    const endereco = await obterEndereco(lat, lon);
    console.log(endereco);
    let dt = new Date();
    let datetime = dt.getFullYear() + "-";
    datetime += (dt.getMonth() + 1) >= 10 ? (dt.getMonth() + 1) + "-" : '0' + (dt.getMonth() + 1) + "-";
    datetime += dt.getDate() >= 10 ? dt.getDate() + "-" : '0' + dt.getDate() + "-";
    datetime += dt.getHours() >= 10 ? dt.getHours() + ":" : '0' + dt.getHours() + ":";
    datetime += dt.getMinutes() >= 10 ? dt.getMinutes() + ":" : '0' + dt.getMinutes() + ":";
    datetime += dt.getSeconds() >= 10 ? dt.getSeconds() + ":" : '0' + dt.getSeconds();
    const horario = datetime;

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO entrega (lat, lon, distancia, horario, endereco) VALUES (?, ?, ?, ?, ?)', [lat, lon, distancia, horario, endereco],
        (tx, result) => {
          Alert.alert('Salvar', 'Entrega salva!')
        },
        error => {
          Alert.alert('Salvar', 'Erro ao salvar entrega! Tente novamente!')
        }
      );
    });
  }

  export function deletarEntrega(id : number){
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM entrega WHERE id = ?', [id],
          (tx, result) => {
            Alert.alert('Deletar', 'Entrega deletada!');
          },
          error =>{
            Alert.alert('Deletar', 'Erro ao deletar! Tente novamente!');
          }
        );
      })
  }

  export function obterEntregas() {
    let entregas : any[] = [];
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM ENTREGA ORDER BY id DESC', [], (tx, result) => {
  
          for(let i = 0; i < result.rows.length; i++){
            const row = result.rows.item(i);
            entregas.push(row);
          }
          resolve(entregas);
          
        }, (error) => {
          reject(error);
        });
      });
    })
  }
  
  export function obterEntregasPorId(id:number) {
    let entregas : any[];
    const query = db.transaction(tx => {
      tx.executeSql('SELECT * FROM ENTREGA WHERE id = ?', [id], (tx, result) => {
        for(let i = 0; i < result.rows.length; i++){
          const row = result.rows.item(i);
          entregas.push(row);
        } 
        return entregas;
      });
    });
    
  }
