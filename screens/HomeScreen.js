import React, { useEffect, useLayoutEffect, useState } from "react"
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native"
import { Avatar } from "react-native-elements"
import { TouchableOpacity } from "react-native"
import CustomListItem from "../components/CustomListItem"
import { SimpleLineIcons } from "@expo/vector-icons"
import { signOut } from 'firebase/auth'
import { collection, onSnapshot, query } from "firebase/firestore"
import { db, auth } from "../fire"


const HomeScreen = ({ navigation }) => {

    const [chats, setChats]  = useState([])

    const signOutUser = () => {
        signOut(auth).then(() => {
            navigation.replace('Login')
        })
    }

    useEffect(() => {
        const q = query(collection(db, "chats"))
        const unsubscribe = onSnapshot( q, (snapshot) => {
            setChats(snapshot.docs.map (doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
        return unsubscribe
    }, [])

    useLayoutEffect( () => {
        navigation.setOptions({
            title: "Chats",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{marginLeft: 0}}>
                    <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 20,
                    marginRight: 20
                }}>
                    <TouchableOpacity onPress={ () => navigation.navigate("AddChat") } activeOpacity={0.5}>
                        <SimpleLineIcons name="pencil" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id, 
            chatName
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map( ({id, data: { chatName }}) =>  (
                    <CustomListItem 
                        key={id} 
                        id={id} 
                        chatName={chatName}
                        enterChat={enterChat} 
                    />
                ))} 
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: '100%'
    }
})