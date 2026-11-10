import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        target: 'esnext',
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'supabase-vendor': ['@supabase/supabase-js'],
                    'ui-vendor': ['framer-motion', 'lucide-react', 'date-fns'],
                    'charts-vendor': ['recharts'],
                    'export-vendor': ['jspdf', 'jspdf-autotable', 'xlsx']
                }
            }
        }
    }
})
