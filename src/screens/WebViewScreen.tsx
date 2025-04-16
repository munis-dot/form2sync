import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

const WebViewScreen = ({route}) => {
    const url = route.params.url; // Get the URL from the route params
    console.log(url)
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: url }} />
    </View>
  )
}

export default WebViewScreen

const styles = StyleSheet.create({})