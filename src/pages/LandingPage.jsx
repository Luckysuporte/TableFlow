import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { TrendingUp, Shield, Zap, LayoutDashboard } from 'lucide-react';
import ShaderBackground from '../components/ui/shader-background';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <ShaderBackground />

            <nav className="container" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #7b4397, #00d2ff)', padding: '8px', borderRadius: '8px' }}>
                        <LayoutDashboard size={20} color="white" />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>TableFlow</h1>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Link to="/login">
                        <Button variant="outline" style={{ borderRadius: '9999px', padding: '10px 24px' }}>Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button style={{ borderRadius: '9999px', padding: '10px 24px', background: 'linear-gradient(135deg, #7b4397, #00d2ff)', border: 'none' }}>Criar Conta</Button>
                    </Link>
                </div>
            </nav>

            <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', padding: '40px 20px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                <div style={{ flex: 1, minWidth: '300px', textAlign: 'center' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '20px' }}
                    >
                        Domine sua <span className="text-gradient">Mesa Proprietária</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1.2rem', color: 'white', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}
                    >
                        Controle suas metas e seus resultados de forma simples, visual e eficiente.
                        A ferramenta definitiva para traders profissionais.
                    </motion.p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/register"><Button>Começar Agora</Button></Link>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
                    <Card style={{ width: '100%', maxWidth: '400px', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="flex-center" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-main)', marginBottom: '10px' }}>
                                <TrendingUp size={30} color="white" />
                            </div>
                            <h3>Controle Total</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Visualize seus ganhos, perdas e evolução diária com gráficos intuitivos.</p>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }}></div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Shield size={24} color="#7b4397" />
                                <div>
                                    <h4>Segurança</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Seus dados protegidos.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Zap size={24} color="#00d2ff" />
                                <div>
                                    <h4>Performance</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Interface rápida e fluida.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
