import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { Avatar } from '../Avatar'
import { styles } from './styles'
import LogoSvg from '../../assets/logo.svg'
import { useAuth } from '../../hooks/auth'

export function Header () {
    const { user, signOut } = useAuth()

    return (
        <View style={styles.container}>
            <LogoSvg />

            <View style={styles.logoutButton}>
                <TouchableOpacity onPress={signOut}>
                    {
                        user && <Text style={styles.logoutText}>Sair</Text>
                    }
                </TouchableOpacity>
                <Avatar imageUri={user?.avatar_url} />
            </View>



                       
        </View>
    )
}