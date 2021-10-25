import React, { useEffect, useState } from "react";
import { ScrollView, Text} from "react-native";
import { api } from "../../services/api";
import { io } from 'socket.io-client'

import { Message, MessageProps } from '../Message'
import { styles } from './styles'

let messageQueue: MessageProps[] =[]

const socket = io(String(api.defaults.baseURL))
socket.on('new_message', (newMessage: MessageProps) => {
    messageQueue.push(newMessage)
    
})

export function MessageList () {
    const [ currentMessages, setCurrentMessages ] = useState<MessageProps[]>([])

    useEffect(() => {
        async function fetchMessages() {
            const messagesRes = await api.get<MessageProps[]>('/messages/3')
            setCurrentMessages(messagesRes.data)
        }

        fetchMessages()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            if(messageQueue.length > 0) {
                setCurrentMessages(prevState => [messageQueue[0], prevState[0], prevState[1]])
                messageQueue.shift()
            }
        }, 3000)

        return () => clearInterval(timer)
    }, [])

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps='never'
        >
            {
                currentMessages.map(message => {
                    return <Message 
                        key={message.id}
                        data={message}
                    />
                })
            }
            


        </ScrollView>
    )
}