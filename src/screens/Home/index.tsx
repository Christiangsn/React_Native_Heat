import React from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'

import { Header } from '../../components/Header'
import { MessageList } from '../../components/MessageList'
import { SignInBox } from '../../components/SignInBox'
import { SendMessage } from '../../components/SendMessage'
import { styles } from './styles'
import { useAuth } from '../../hooks/auth'

export function Home () {
    const { user } = useAuth()
    return (
        <KeyboardAvoidingView
            style={{ flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined }
        >
            <View style={styles.container}>
            <Header />
            <MessageList />
            {
                user ? <SendMessage /> : <SignInBox />
            }
            
            </View>
        </KeyboardAvoidingView>

    )
}