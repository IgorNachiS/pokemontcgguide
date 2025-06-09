import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert,
    SafeAreaView, Animated, Easing, Platform, StatusBar, Modal
} from 'react-native';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PokemonTheme } from '../theme/PokemonTheme';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [rotateAnim] = useState(new Animated.Value(0));

    const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = '';

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const animatePokeball = () => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();
    };

    useEffect(() => {
        animatePokeball();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha email e senha.");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Erro no login:", error);
            Alert.alert("Erro no Login", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Erro no cadastro:", error);
            Alert.alert("Erro no Cadastro", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestSignIn = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Erro no login anônimo:", error);
            Alert.alert("Erro", "Não foi possível entrar como convidado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail.trim()) {
            setForgotPasswordMessage("Por favor, insira seu e-mail.");
            return;
        }
        setLoading(true);
        setForgotPasswordMessage('');
        try {
            await sendPasswordResetEmail(auth, forgotPasswordEmail);
            setForgotPasswordMessage("Link de redefinição de senha enviado para seu e-mail!");
            setTimeout(() => {
                setIsForgotPasswordModalVisible(false);
                setForgotPasswordEmail('');
                setForgotPasswordMessage('');
            }, 3000);
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            setForgotPasswordMessage(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            Alert.alert(
                "Login Google (Conceitual)",
                "Para login com Google em um app React Native real, você precisaria integrar o SDK nativo do Google Sign-In e usar signInWithCredential."
            );
        } catch (error) {
            console.error("Erro no login Google:", error);
            Alert.alert("Erro no Login Google", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[PokemonTheme.colors.loginGradientStart, PokemonTheme.colors.loginGradientEnd]}
            style={styles.gradientBackground}
        >
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor={PokemonTheme.colors.loginGradientStart} />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Animated.Image
                            source={require('../../assets/pokeball.png')}
                            style={[styles.pokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
                        />
                        <Text style={styles.title}>{isRegistering ? 'Cadastrar' : 'Login'}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Icon name="email-outline" size={20} color={PokemonTheme.colors.accent} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholderTextColor={PokemonTheme.colors.placeholderText}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="lock-outline" size={20} color={PokemonTheme.colors.accent} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Senha"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                style={styles.input}
                                placeholderTextColor={PokemonTheme.colors.placeholderText}
                            />
                        </View>

                        {isRegistering && (
                            <View style={styles.inputContainer}>
                                <Icon name="lock-check-outline" size={20} color={PokemonTheme.colors.accent} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Confirmar Senha"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    style={styles.input}
                                    placeholderTextColor={PokemonTheme.colors.placeholderText}
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={isRegistering ? handleSignUp : handleLogin}
                            disabled={loading}
                            style={styles.button}
                        >
                            {loading ? (
                                <ActivityIndicator color={PokemonTheme.colors.card} />
                            ) : (
                                <>
                                    <Icon name={isRegistering ? "account-plus" : "login"} size={20} color={PokemonTheme.colors.card} style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>{isRegistering ? 'Cadastrar' : 'Entrar'}</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {!isRegistering && (
                            <TouchableOpacity
                                onPress={() => setIsForgotPasswordModalVisible(true)}
                                style={styles.forgotPasswordButton}
                            >
                                <Text style={styles.forgotPasswordButtonText}>Esqueceu a senha?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => setIsRegistering(!isRegistering)}
                            style={styles.toggleButton}
                        >
                            <Text style={styles.toggleButtonText}>
                                {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
                            </Text>
                        </TouchableOpacity>

                        {!isRegistering && (
                            <>
                                <TouchableOpacity
                                    onPress={handleGoogleSignIn}
                                    disabled={loading}
                                    style={[styles.button, styles.googleButton]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={PokemonTheme.colors.card} />
                                    ) : (
                                        <>
                                            <Icon name="google" size={20} color={PokemonTheme.colors.card} style={styles.buttonIcon} />
                                            <Text style={styles.buttonText}>Entrar com Google</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleGuestSignIn}
                                    disabled={loading}
                                    style={[styles.button, styles.guestButton]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={PokemonTheme.colors.card} />
                                    ) : (
                                        <>
                                            <Icon name="incognito" size={20} color={PokemonTheme.colors.card} style={styles.buttonIcon} />
                                            <Text style={styles.buttonText}>Entrar como Convidado</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </SafeAreaView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isForgotPasswordModalVisible}
                onRequestClose={() => setIsForgotPasswordModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Redefinir Senha</Text>
                        <TextInput
                            placeholder="Seu e-mail"
                            value={forgotPasswordEmail}
                            onChangeText={setForgotPasswordEmail}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholderTextColor={PokemonTheme.colors.placeholderText}
                        />
                        {forgotPasswordMessage ? (
                            <Text style={styles.forgotPasswordMessage}>{forgotPasswordMessage}</Text>
                        ) : null}
                        <TouchableOpacity
                            onPress={handleForgotPassword}
                            disabled={loading}
                            style={[styles.button, styles.modalButton]}
                        >
                            {loading ? (
                                <ActivityIndicator color={PokemonTheme.colors.card} />
                            ) : (
                                <Text style={styles.buttonText}>Enviar Link</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setIsForgotPasswordModalVisible(false);
                                setForgotPasswordEmail('');
                                setForgotPasswordMessage('');
                            }}
                            style={[styles.button, styles.modalButton, styles.modalCloseButton]}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientBackground: {
        flex: 1,
    },
    container: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        ...PokemonTheme.shadows.card,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    pokeballIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    title: {
        ...PokemonTheme.textVariants.title,
        color: PokemonTheme.colors.primary,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PokemonTheme.colors.inputBackground,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 50,
        borderWidth: 1,
        borderColor: PokemonTheme.colors.inputBorder,
        ...PokemonTheme.shadows.input,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        color: PokemonTheme.colors.text,
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: PokemonTheme.colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        ...PokemonTheme.shadows.button,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: PokemonTheme.colors.card,
        fontWeight: 'bold',
        fontSize: 16,
    },
    toggleButton: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 15,
    },
    toggleButtonText: {
        color: PokemonTheme.colors.primary,
        fontSize: 15,
        fontWeight: '500',
    },
    guestButton: {
        backgroundColor: PokemonTheme.colors.secondaryText,
        marginTop: 10,
    },
    googleButton: {
        backgroundColor: '#DB4437',
        marginTop: 10,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 15,
        paddingVertical: 5,
    },
    forgotPasswordButtonText: {
        color: PokemonTheme.colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        margin: 20,
        backgroundColor: PokemonTheme.colors.card,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
        maxWidth: 350,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: PokemonTheme.colors.text,
        marginBottom: 20,
    },
    modalButton: {
        width: '100%',
        marginTop: 10,
    },
    modalCloseButton: {
        backgroundColor: PokemonTheme.colors.notification,
    },
    forgotPasswordMessage: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        color: PokemonTheme.colors.notification,
        fontSize: 14,
    },
});

export default LoginScreen;