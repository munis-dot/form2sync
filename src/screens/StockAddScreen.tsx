import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native'

const StockAddScreen = () => {

  const user = useSelector((state: RootState) => state.auth.user);

  const route = useRoute();
  const stockToEdit = route.params?.stock || null;

  const [formData, setFormData] = useState({
    productName: stockToEdit?.productName || '',
    quantity: stockToEdit?.quantity || '',
    price: stockToEdit?.price || '',
    category: stockToEdit?.category || '',
    description: stockToEdit?.description || '',
    image: stockToEdit?.image || '', // Could be a full image URL
  });

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return
    }
    if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage)
      return
    }
    if (response.assets && response.assets[0].uri) {
      setFormData({ ...formData, image: response.assets[0].uri })
    }
  }

  const showImagePickerOptions = () => {
    Alert.alert(
      'Add Product Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            launchCamera({
              mediaType: 'photo' as MediaType,
              quality: 0.8,
              maxWidth: 2000,
              maxHeight: 2000,
              saveToPhotos: true,
            }, handleImageResponse)
          }
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            launchImageLibrary({
              mediaType: 'photo' as MediaType,
              quality: 0.8,
              maxWidth: 2000,
              maxHeight: 2000,
            }, handleImageResponse)
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    )
  }
  console.log(user)
  const handleSubmit = async () => {
    if (!formData.image) {
      Alert.alert('Image is required');
      return;
    }

    const form = new FormData();
    form.append('productName', formData.productName);
    form.append('quantity', formData.quantity);
    form.append('price', formData.price);
    form.append('farmName', user?.farmName);
    form.append('userId', user?._id);
    form.append('category', formData.category);
    form.append('description', formData.description);

    if (formData.image && !formData.image.startsWith('uploads')) {
      form.append('image', {
        uri: formData.image,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
    }

    try {
      const url = stockToEdit
        ? `http://192.168.14.130:5000/stock/${stockToEdit._id}`
        : 'http://192.168.14.130:5000/stock';

      const method = stockToEdit ? 'put' : 'post';
      console.log(form)
      const res = await axios({
        method,
        url,
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200 || res.status === 201) {
        Alert.alert('Success', `Stock ${stockToEdit ? 'updated' : 'created'} successfully`);
      } else {
        Alert.alert('Error', res.data?.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', `Failed to ${stockToEdit ? 'update' : 'create'} stock`);
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Add New Stock</Text>

          <View style={styles.imageUploadContainer}>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={showImagePickerOptions}
              activeOpacity={0.7}
            >
              {formData.image ? (
                <>
                  <Image
                    source={{ uri: formData.image }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={showImagePickerOptions}
                  >
                    <Icon name="camera" size={20} color="#fff" />
                    <Text style={styles.changeImageText}>Change</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="camera-plus" size={40} color="#666" style={styles.uploadIcon} />
                  <Text style={styles.uploadText}>Add Product Image</Text>
                  <Text style={styles.uploadSubText}>Tap to capture or choose photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={formData.productName}
              onChangeText={(text) => setFormData({ ...formData, productName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter quantity"
              keyboardType="numeric"
              value={formData.quantity + ''}
              onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              keyboardType="decimal-pad"
              value={formData.price + ""}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {stockToEdit ? 'Update Stock' : 'Add Stock'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default StockAddScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#282c3f',
    marginBottom: 30,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9e9eb',
    fontSize: 16,
    color: '#282c3f',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: 'green',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  imageUploadContainer: {
    marginBottom: 24,
    height: 200,
    borderWidth: 1,
    borderColor: '#e9e9eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageUploadButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  uploadSubText: {
    fontSize: 14,
    color: '#282c3f',
  },
  uploadIcon: {
    marginBottom: 12,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  changeImageText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
})