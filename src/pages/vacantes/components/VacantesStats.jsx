/**
 * VacantesStats Component
 * Statistics cards for the MisVacantes page.
 * 
 * @module pages/vacantes/components/VacantesStats
 */

/**
 * VacantesStats component
 */
const VacantesStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard value={stats.total} label="Total" />
            <StatCard
                value={stats.activas}
                label="Activas"
                accent="emerald"
                valueColor="text-emerald-600"
            />
            <StatCard
                value={stats.pausadas}
                label="Pausadas"
                accent="amber"
                valueColor="text-amber-600"
            />
        </div>
    );
};

const StatCard = ({ value, label, accent, valueColor = 'text-slate-800' }) => {
    const accentClass = accent ? `border-l-4 border-l-${accent}-500` : '';

    return (
        <div className={`bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm ${accentClass}`}>
            <span className={`block text-3xl font-bold ${valueColor}`}>{value}</span>
            <span className="text-sm text-slate-500">{label}</span>
        </div>
    );
};

export default VacantesStats;
