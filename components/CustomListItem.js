import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'

import { db } from "../fire"
import { collection, orderBy, query, onSnapshot } from "firebase/firestore"


const CustomListItem = ({ id, chatName, enterChat }) => {
    const [chatMesseges, setChatMesseges] = useState([])

    useEffect(() => {
        const collectionRef = collection(db, "chats", id ,"messages")
        const q = query(collectionRef, orderBy("timestamp", "desc"))
        const unsubscribe = onSnapshot( q, (snapshot) => 
            setChatMesseges(
                snapshot.docs.map (doc => doc.data()
            ))
        )
        return unsubscribe
    }, [])

    return (
        <ListItem 
            bottomDivider
            onPress={() => enterChat(id, chatName)} 
            key={id}
        >
            <Avatar 
                rounded
                source={{
                    uri: chatMesseges?.[0]?.photoURL ||
                    "https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={ styles.listItemTitle }>
                    { chatName }
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {chatMesseges?.[0]?.displayName}: {chatMesseges?.[0]?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({ 
    listItemTitle: {
        fontWeight: "800" 
    }
})