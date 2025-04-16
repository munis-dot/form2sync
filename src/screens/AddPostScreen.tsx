import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert
} from 'react-native';
import React, { useState } from 'react';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AddPostScreen = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    const [formData, setFormData] = useState({
        image: '',
        title: '',
        description: ''
    });

    const handleImageResponse = (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
            return Alert.alert('Error', response.errorMessage || 'Image selection cancelled');
        }

        if (response.assets && response.assets[0].uri) {
            setFormData({ ...formData, image: response.assets[0].uri });
        }
    };

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
    };

    const handleSubmit = async () => {
        if (!formData.image || !formData.title || !formData.description) {
            return Alert.alert('Error', 'All fields are required');
        }

        const postForm = new FormData();
        postForm.append('title', formData.title);
        postForm.append('postedBy', user?._id);
        postForm.append('description', formData.description);
        postForm.append('image', {
            uri: formData.image,
            name: 'post.jpg',
            type: 'image/jpeg',
        });

        try {
            const res = await axios.post('http://192.168.14.130:5000/ad', postForm, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === 201) {
                Alert.alert('Success', 'Post created successfully');
                setFormData({ image: '', title: '', description: '' });
            } else {
                Alert.alert('Error', 'Something went wrong');
            }
        } catch (err) {
            console.error(err?.response?.data || err.message);
            Alert.alert('Error', 'Failed to create post');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    <Text style={styles.heading}>Create Ad</Text>

                    <TouchableOpacity style={styles.imageBox} onPress={showImagePickerOptions}>
                        {formData.image ? (
                            <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Icon name="image-plus" size={40} color="#aaa" />
                                <Text style={styles.placeholderText}>Add Image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        placeholder="Title"
                        style={styles.input}
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                    />

                    <TextInput
                        placeholder="Description"
                        style={[styles.input, styles.textArea]}
                        multiline
                        numberOfLines={4}
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                    />

                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Post Ad</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddPostScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefefe',
    },
    form: {
        padding: 20,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#282c3f',
        marginBottom: 24,
        textAlign: 'center',
    },
    imageBox: {
        height: 200,
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 8,
        color: '#777',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitBtn: {
        backgroundColor: '#00c853',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#00c853',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
});
