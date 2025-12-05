import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NeonInput from '../components/NeonInput';
import { Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ShaderBackground from '../components/ui/shader-background';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validações
        if (newPassword.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não correspondem');
            return;
        }

        setLoading(true);
        const result = await updatePassword(newPassword);
        setLoading(false);

        if (result.success) {
            // Redirecionar para login com mensagem de sucesso
            navigate('/login', { state: { message: 'Senha atualizada com sucesso! Faça login com sua nova senha.' } });
        } else {
            setError(result.message);
        }
    };

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
            <div style={{
                position: 'absolute',
                bottom: '-30%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(100px)',
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
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
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
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                >
                    <Lock size={36} color="#a855f7" strokeWidth={2} />
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
                    Nova Senha
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
                    Digite sua nova senha abaixo
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
                        label="Nova Senha"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Digite sua nova senha"
                        required
                    />
                    <NeonInput
                        label="Confirmar Senha"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Digite novamente"
                        required
                    />

                    {newPassword && (
                        <div style={{
                            marginTop: '16px',
                            marginBottom: '8px',
                            padding: '12px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: newPassword.length >= 6 ? '#22c55e' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.85rem',
                                marginBottom: '4px'
                            }}>
                                <CheckCircle size={16} />
                                <span>Mínimo de 6 caracteres</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: newPassword === confirmPassword && confirmPassword !== '' ? '#22c55e' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.85rem'
                            }}>
                                <CheckCircle size={16} />
                                <span>Senhas correspondem</span>
                            </div>
                        </div>
                    )}

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
                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                        }}
                    >
                        {loading ? 'Atualizando...' : 'Redefinir Senha'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
