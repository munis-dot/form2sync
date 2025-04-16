import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

const LoanScreen = () => {

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://www.agrifarming.in/agriculture-loans-farmers-india' }} />
    </View>
  )
}

export default LoanScreen

const styles = StyleSheet.create({})