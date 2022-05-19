import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { db } from '../fire'
import { addDoc, collection } from 'firebase/firestore'

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("")

    useLayoutEffect( () => {
        navigation.setOptions({
            title: "Add a new chat",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const createChat = async () => {
         const collectionRef = collection(db, "chats")
         addDoc(collectionRef, { "chatName" : input })
            .then ( () => navigation.goBack() )
            .catch( error => console.log("error", error))
    }

    return (
        <View style={styles.container}>
            <Input 
                placeholder="Enter a chat name" 
                value={input} 
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={createChat}
                leftIcon={
                    <Icon name="wechat" type="antdesign" size={24} color="black" />
                }
            />
            <Button onPress={createChat} title="Create new Chat" />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 30,
        height: "100%"
    }
})