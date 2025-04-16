import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

const FarmingPractices = () => {

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://agricultureguruji.com/blog/' }} />
    </View>
  )
}

export default FarmingPractices

const styles = StyleSheet.create({})