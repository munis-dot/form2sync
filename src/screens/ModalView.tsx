// components/ModalView.tsx
import React from 'react'
import { Modal, View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface ModalViewProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const ModalView = ({ visible, onClose, children, title }: ModalViewProps) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default ModalView

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalContent: {
    paddingBottom: 20,
  },
})
