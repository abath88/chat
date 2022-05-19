import React, { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from "../fire"

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged( auth,  (authUser) => {
            if(authUser) {
                navigation.replace("Home")
            }
        })
        return unsubscribe;
    }, [])


    const signIn = () => {
        signInWithEmailAndPassword( auth, email, password)
            .catch( (error) => alert(error) )
    }

    return (
        <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <Image 
                    source={{
                        uri: 
                            'http://brain.abath.pl/img/logo.png'
                        }}
                    style={{width: 100, height: 100, marginBottom: 100}}
                />

                <View style={styles.inputContainer}>
                    <Input 
                        placeholder='Email' 
                        autoFocus type="email" 
                        value={ email } 
                        onChangeText={ (text) => setEmail(text) }
                    />
                    <Input 
                        placeholder='Password' 
                        secureTextEntry 
                        type="password" 
                        value={ password }
                        onChangeText={ (text) => setPassword(text) }
                        onSubmitEditing={signIn}
                    />
                </View>

                <Button containerStyle={styles.button} onPress={signIn} title='Login' />
                <Button containerStyle={styles.button} onPress={() => navigation.navigate("Register")} type="outline" title='Register' />
                <View style={{height: 100}} /> 
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10
    }
})