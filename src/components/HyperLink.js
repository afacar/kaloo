import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';

export default function HyperLink(props) {
  const { text, link } = props

  return (
    <TouchableOpacity onPress={() => Linking.openURL(link)} >
      <Text style={{ color: '#196BFF' }}>{text}</Text>
    </TouchableOpacity>
  )

}


