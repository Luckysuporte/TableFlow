import React, { useState, useEffect } from 'react';
import './PWAInstallPrompt.css';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the install prompt
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to the install prompt: ${outcome}`);

        // Clear the deferredPrompt for next time
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Store in localStorage to not show again for a while
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    // Check if user dismissed recently (within 7 days)
    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - dismissedTime < sevenDaysInMs) {
                setShowPrompt(false);
            }
        }
    }, []);

    if (!showPrompt) {
        return null;
    }

    return (
        <div className="pwa-install-prompt">
            <div className="pwa-install-content">
                <div className="pwa-install-icon">
                    <img src="/icons/icon-192x192.png" alt="TableFlow Icon" />
                </div>
                <div className="pwa-install-text">
                    <h3>Instalar TableFlow</h3>
                    <p>Instale nosso app para acesso rápido e experiência offline!</p>
                </div>
                <div className="pwa-install-buttons">
                    <button className="pwa-install-btn" onClick={handleInstallClick}>
                        Instalar
                    </button>
                    <button className="pwa-dismiss-btn" onClick={handleDismiss}>
                        Agora não
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
