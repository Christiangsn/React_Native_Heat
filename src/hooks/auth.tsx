import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AuthSessions from 'expo-auth-session'
import { api } from '../services/api';

const CLIENT_ID = 'd185c0303791e2755de8';
const SCOPE = 'read:user';
const USER_STORAGE = '@heat:user'
const TOKEN_STORAGE = '@heat:token'

type User = {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
}

type AuthContextData = {
    user: User | null;
    isSignIn: boolean;
    signIn: () => Promise<void>
    signOut: () => Promise<void>
}

type AuthProviderProps = {
    children: React.ReactNode
}

type AuthResponse = {
    token: string;
    user: User;
}

type AuthorizationResponse = {
    params: {
        code?: string;
        error?: string; 
    },
    type?: string;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider ( { children }: AuthProviderProps ) {
    const [ isSignIn, setIsSignIn ] = useState<boolean>(true)
    const [ user, setUser ] = useState<User | null>(null)

    async function signIn () {

        try {
            setIsSignIn(true)
            console.log('entrou aqui')
            const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
            const authGithub = await AuthSessions.startAsync( { authUrl }) as AuthorizationResponse
            console.log(authGithub)
            if(authGithub.type === 'success' && authGithub.params.error !== 'access_denied'){
                
                const authResponse = await api.post<AuthResponse>('/signin/callback', {
                    "code": authGithub.params.code
                })
                const { user, token } = authResponse.data
                console.log('user aqui', user)
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
                await AsyncStorage.setItem(TOKEN_STORAGE, token)
    
                setUser(user)
            }
            
    
                
        } catch (error) {
            console.log(error)
        } finally {
            setIsSignIn(false)
        }

    }

    async function signOut () {
        setUser(null)
        await AsyncStorage.removeItem(USER_STORAGE)
        await AsyncStorage.removeItem(TOKEN_STORAGE)
    }

    useEffect ( () => {
        async function loadingSetDataUser() {
            const userStorage = await AsyncStorage.getItem(USER_STORAGE)
            const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE)
            console.log('storages', userStorage, 'and', tokenStorage)
            if(userStorage && tokenStorage) {
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`
                setUser(JSON.parse(userStorage))
            } 

            setIsSignIn(false)
        }

        loadingSetDataUser()
    } , [])

    return (
        <AuthContext.Provider value={ { signIn, signOut, isSignIn, user } } >
            { children }
        </AuthContext.Provider>
     )

}

function useAuth () {
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }