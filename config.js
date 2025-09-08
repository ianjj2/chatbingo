// Configuração do Supabase
require('dotenv').config();

const config = {
    supabase: {
        url: process.env.SUPABASE_URL || 'https://rlqdeczmumtbdsonjehe.supabase.co',
        anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWRlY3ptdW10YmRzb25qZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDcxNTEsImV4cCI6MjA3MjMyMzE1MX0.m4jkEPvAFP-IOxoM1oXsVIEiuggCLeVzkEDSAkcjs3I'
    },
    server: {
        port: process.env.PORT || 3000
    }
};

module.exports = config;
