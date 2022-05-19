import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { Button, Input, Text } from 'react-native-elements'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../fire'

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [imageURL, setImageURL] = useState("")

    useLayoutEffect (() => {
        navigation.setOptions({
            headerBackTitle: "Back to Login"
        })
    }, [navigation])

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(authUser => {
                updateProfile( authUser.user, {
                    displayName: name,
                    photoURL: imageURL || "https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                })
            })
            .catch( (error) => alert(error.message))
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <Text h3 style={{ marginBottom: 50 }}>
                Create a Signal account
            </Text>

            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Full Name"
                    autofocus
                    type="text"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Input 
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input 
                    placeholder="Password"
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input 
                    placeholder="Profile Picture URL (optional)"
                    type="text"
                    value={imageURL}
                    onChangeText={(text) => setImageURL(text)}
                    onSubmitEditing={register}
                />
            </View>

            <Button 
                containerStyle={styles.button}
                title="register"
                onPress={register}
                raised
            />
            <View style={{height: 100}} />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    button: {
        width: 200,
        marginTop: 10
    },
    inputContainer: {
        width: 300
    }
})