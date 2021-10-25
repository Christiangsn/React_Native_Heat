import React, { useState }from "react";
import { Alert, Keyboard, TextInput, View } from "react-native";
import { api } from "../../services/api";
import { COLORS } from "../../theme";
import { Button } from '../Button'

import { styles } from "./styles";

export function SendMessage () {
    const [ message, setMessage ] = useState('')
    const [ sendingMessage, setSendingMessage ] = useState<boolean>(false)

    async function handleMessage () {
        const messageFormatted = message.trim()

        if(messageFormatted.length > 0) {
            setSendingMessage(true)
            await api.post('/messages', {
                text: messageFormatted
            })

            setMessage('')
            //Função de fechar o teclado
            Keyboard.dismiss()
            setSendingMessage(false)
            Alert.alert('Sua expectativa foi registrada :)')
            

        } else {
            Alert.alert('Escreva uma menssagem para enviar')
        }
    }
    return (
        <View style={styles.container}>
            <TextInput
                keyboardAppearance='dark' 
                placeholder='Digite aqui sua expectativa'
                placeholderTextColor={COLORS.GRAY_PRIMARY}
                multiline
                maxLength={140}
                onChangeText={setMessage}
                value={message}
                style={styles.input}
                editable={!sendingMessage}

            />

            <Button 
                title='Enviar Messagem'
                backgroundColor={COLORS.PINK}
                color={COLORS.WHITE}
                isLoading={sendingMessage}
                onPress={handleMessage}
            />
            
        </View>
    )
}