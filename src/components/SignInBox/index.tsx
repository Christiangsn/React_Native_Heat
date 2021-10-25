import React from "react";
import { View } from "react-native";
import { useAuth } from '../../hooks/auth'

import { Button } from '../Button'
import { COLORS } from "../../theme";
import { styles } from "./styles";

export function SignInBox () {
    const { signIn, isSignIn } = useAuth()

    return (
        <View style={styles.container}>

            <Button 
                title='Entrar com o Github'
                color={COLORS.BLACK_PRIMARY}
                backgroundColor={COLORS.YELLOW}
                icon='github'
                onPress={signIn}
                isLoading={isSignIn}
            />

        </View>
    )
}