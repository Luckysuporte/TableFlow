import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
            style={{
                padding: '24px',
                ...props.style
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
