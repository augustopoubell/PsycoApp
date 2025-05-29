import React from 'react';
import { View, Text, Button} from 'react-native';
import { styles } from '../styles/styles';

const HomeScreen = ({ usuarioLogado, mudarTela }) => {
    return (
      <View>
        <Text style= {styles.titulo}> Bem-vindo, {usuarioLogado}| </Text>

        <Button title= "Sair" onPress={() => mudarTela('login')} />
      </View>    
    );
};

export default HomeScreen;