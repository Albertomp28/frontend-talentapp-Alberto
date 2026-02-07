/**
 * KanbanColumn Component
 * Individual column in the Kanban board.
 * 
 * @module pages/kanban/components/KanbanColumn
 */

import KanbanCandidateCard from './KanbanCandidateCard';

/**
 * KanbanColumn component
 */
const KanbanColumn = ({
    columna,
    candidatos,
    isDropTarget,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragStart,
    onDragEnd,
    onCardClick,
}) => {
    return (
        <div
            className={`
        min-w-[280px] w-[280px] bg-white border rounded-xl 
        flex flex-col transition-all shadow-premium-sm
        ${isDropTarget ? 'border-brand-500 bg-brand-50/50' : 'border-neutral-200'}
      `}
            onDragOver={(e) => onDragOver(e, columna.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, columna.id)}
        >
            {/* Column Header */}
            <div className="p-4 border-b border-neutral-100">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: columna.color }}
                    />
                    <h3 className="font-semibold text-neutral-800">{columna.titulo}</h3>
                    <span className="ml-auto bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded-full">
                        {candidatos.length}
                    </span>
                </div>
                <p className="text-xs text-neutral-500">{columna.descripcion}</p>
            </div>

            {/* Column Body */}
            <div className="p-3 flex-1 space-y-3 overflow-y-auto max-h-[500px]">
                {candidatos.map(candidato => (
                    <KanbanCandidateCard
                        key={candidato.id}
                        candidato={candidato}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onClick={() => onCardClick(candidato)}
                    />
                ))}

                {candidatos.length === 0 && (
                    <div className="text-center py-8 text-neutral-300 text-sm">
                        Sin candidatos
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
