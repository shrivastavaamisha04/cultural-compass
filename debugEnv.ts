// Debug utility to check environment variables in production
export const debugEnv = () => {
    console.log('=== Environment Debug ===');
    console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'SET' : 'MISSING');
    console.log('API_KEY:', import.meta.env.API_KEY ? 'SET' : 'MISSING');
    console.log('All env keys:', Object.keys(import.meta.env));
    console.log('========================');
};
