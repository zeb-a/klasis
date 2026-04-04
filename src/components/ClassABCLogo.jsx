

const ClassABCLogo = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
                src="/icons/Klasiz-trimmed.png" 
                alt="Klasiz Logo"
                style={{ height: 'clamp(40px, 5vw, 60px)', width: 'auto' }}
            />
            <span style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                fontSize: 'clamp(18px, 2.5vw, 28px)', 
                fontWeight: '800', 
                color: '#5e6063',
                letterSpacing: '-0.5px'
            }}>
                Klasiz<span style={{ color: '#3B82F6' }}>.fun</span>
            </span>
        </div>
    );
};

export default ClassABCLogo;