'use client';

import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
    useEffect(() => {
        // Fix for Swagger UI in Next.js
        const style = document.createElement('style');
        style.innerHTML = '.swagger-ui .scheme-container { position: sticky; top: 0; z-index: 1; background: #fff; }';
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <SwaggerUI url="/api/docs" />
            </div>
        </div>
    );
} 