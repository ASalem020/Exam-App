/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/diplomas',
                permanent: true,
            },
        ];
    },
    
    images: {
        
        domains: ['exam.elevateegy.com'],
    },
};

export default nextConfig;
