import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NeonInput from '../components/NeonInput';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ShaderBackground from '../components/ui/shader-background';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await resetPassword(email);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.message);
        }
    };

    if (success) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <ShaderBackground />

                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(20, 0, 39, 0.5)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: '100%',
                        maxWidth: '480px',
                        background: 'rgba(20, 0, 39, 0.7)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '48px 40px',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 30px',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
                            border: '1px solid rgba(34, 197, 94, 0.3)'
                        }}
                    >
                        <Mail size={36} color="#22c55e" strokeWidth={2} />
                    </motion.div>

                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'white',
                        marginBottom: '16px',
                        textShadow: '0 0 30px rgba(34, 197, 94, 0.5)'
                    }}>
                        Email Enviado!
                    </h2>

                    <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '32px'
                    }}>
                        Enviamos um link de recuperação para <strong style={{ color: '#a855f7' }}>{email}</strong>.
                        <br /><br />
                        Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                    </p>

                    <Link to="/login">
                        <button style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '1.05rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <ArrowLeft size={20} />
                            Voltar para Login
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <ShaderBackground />

            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(20, 0, 39, 0.5)',
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>

            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    background: 'rgba(20, 0, 39, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '48px 40px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 30px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                >
                    <Mail size={36} color="#a855f7" strokeWidth={2} />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '12px',
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        color: 'white',
                        textShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                        letterSpacing: '-0.5px'
                    }}
                >
                    Esqueceu a Senha?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '40px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.95rem',
                        fontWeight: '300'
                    }}
                >
                    Digite seu email e enviaremos um link para recuperação
                </motion.p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#fca5a5',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <NeonInput
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginTop: '12px',
                            background: loading ? 'rgba(139, 92, 246, 0.5)' : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '1.05rem',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.6)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
                        }}
                    >
                        {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.95rem',
                    fontWeight: '300'
                }}>
                    Lembrou a senha?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#a855f7',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            textShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#c084fc';
                            e.target.style.textShadow = '0 0 20px rgba(168, 85, 247, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#a855f7';
                            e.target.style.textShadow = '0 0 10px rgba(168, 85, 247, 0.3)';
                        }}
                    >
                        Voltar para login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
