import React, { useLayoutEffect, useState, useRef } from 'react'
import { 
    KeyboardAvoidingView, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View, 
    TextInput,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'

import { collection, serverTimestamp, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore'
import { db, auth } from "../fire"


const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState("")
    const [messages, setMesseges] = useState([])

    let scrollViewRef = useRef(null);

    useLayoutEffect( () => {
        navigation.setOptions({
            title: "Chat",
            headerTitleAlign: "left",
            headerBackTitleVisible: false,
            headerTitle: () => (
                <View style= { styles.headerTitle }>
                    <Avatar rounded source={{ 
                        uri : messages?.[messages?.length - 1]?.data.photoURL ||
                            "https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                        }}
                    />
                    <Text style={ styles.headerTitleText }>
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={ navigation.goBack }>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages])

    useLayoutEffect(() => {
        const collectionRef = collection(db, 'chats', route.params.id ,'messages')
        const q = query(collectionRef, orderBy("timestamp"))
        const unsubscribe = onSnapshot( q, (snapshot) => 
            setMesseges(
                snapshot.docs.map (doc => ({
                id: doc.id,
                data: doc.data()
            })))
        )
        return unsubscribe
    }, [route])

    const sendMessage = () => {
        Keyboard.dismiss();
        const collectionRef = collection(db, 'chats', route.params.id ,'messages')
        addDoc(collectionRef, { 
            timestamp: serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
         })
            .then ( () => setInput('') )
            .catch( error => console.log("error", error))
    }

    return (
        <SafeAreaView style={ styles.container }>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={90}
                style={styles.container}
            >
                <TouchableWithoutFeedback>
                    <>
                        <ScrollView
                            contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
                            ref={scrollViewRef}
                            onContentSizeChange={() => {
                            scrollViewRef.current.scrollToEnd({ animated: true, index: -1 }, 200);}}
                        >
                            {messages.map(({id, data}, index, elements) => 
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.reciever}>
                                        {elements[index+1]?.data.email !== data.email && <Avatar 
                                            position="absolute"
                                            size={20}
                                            left={5}
                                            bottom={10}
                                            source={{
                                                uri: data.photoURL
                                            }}
                                        />}
                                        
                                        <View style={styles.recieverTextContainer}>
                                            <Text style={styles.recieverText}>{data.message}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender} borderBottomLeftRadius={50}>
                                        {elements[index+1]?.data.email !== data.email &&
                                            <Avatar 
                                                position="absolute"
                                                left={5}
                                                bottom={10}
                                                rounded
                                                size={30}
                                                source={{
                                                    uri: data.photoURL
                                                }}
                                            />
                                        }
                                        <View style={styles.senderTextContainer}>
                                            <Text style={styles.senderText}>{data.message}</Text>
                                            {elements[index+1]?.data.email !== data.email &&
                                                <Text style={styles.senderName}>{data.displayName}</Text>
                                            }
                                        </View>
                                    </View>
                                )
                            )}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput 
                                placeholder="Message"
                                style={styles.textInput}
                                onChangeText={(text) => setInput(text)}
                                value={input}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                                <Ionicons name="send" size={24} color="#2B68E6" />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    headerTitle: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerTitleText: {
        color: "white", 
        marginLeft: 10,
        fontWeight: "700"
    },
    reciever: {
        paddingLeft: 20,
        paddingBottom: 5,
        paddingTop: 5,
        paddingRight: 25,
        alignSelf: "flex-end",
        borderRadius: 20,
        maxWidth: "80%",
        position: "relative",
        flex: 1,
        flexDirection: "row-reverse",
        alignItems: "center"
    },
    recieverTextContainer: {
        position: "relative",
        backgroundColor:"#ececec",
        borderRadius: 10,
        borderBottomLeftRadius: 50,
        borderTopLeftRadius: 50,
        padding: 15,
        marginRight: 10,
    },
    recieverText: {
        color: "black",
        marginLeft: 0,
    },
    sender: {
        paddingLeft: 5, 
        paddingBottom: 2,
        paddingRight: 5,
        alignSelf: "flex-start",
        
        maxWidth: "80%",
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    senderTextContainer: {
        position: "relative",
        borderRadius: 10,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: "#2b68e6",
        padding: 15,
        marginLeft: 35
    },
    senderText: {
        color: "white",
        marginLeft: 0,
    },
    senderName: {
        position: "absolute",
        left: 10,
        bottom: -15,
        paddingRight: 10,
        fontSize: 10,
        color: "grey",
        width: "100%",
        minWidth: 180
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: "transparent",
        backgroundColor: "#ececec",
        borderWidth: 1,
        padding: 10,
        color: "grey",
        borderRadius: 30
    }

})