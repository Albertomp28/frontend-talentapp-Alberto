/**
 * KanbanBoard Page
 * Recruitment pipeline board with drag-and-drop functionality.
 * 
 * Refactored to use:
 * - useKanbanBoard hook for state management
 * - Subcomponents for columns, cards, and modals
 * 
 * @module pages/kanban/KanbanBoard
 */

// Custom Hook
import { useKanbanBoard } from './hooks/useKanbanBoard';

// Constants
import { PIPELINE_COLUMNS } from './constants/kanbanConstants';

// Subcomponents
import KanbanColumn from './components/KanbanColumn';
import CandidateDetailModal from './components/CandidateDetailModal';
import CVUploadModal from './components/CVUploadModal';
import MultiCVUploadModal from './components/MultiCVUploadModal';

/**
 * KanbanBoard Page Component
 */
const KanbanBoard = () => {
  const {
    // State
    dragOverColumn,
    filtroVacante,
    filtroScoreMin,
    selectedCandidato,
    showUploadModal,
    uploadStep,
    cvFile,
    cvData,
    analysisResult,
    extractingData,
    deepAnalysisLoading,

    // Computed
    stats,
    vacantes,
    loadingVacantes,

    // Methods
    getCandidatosPorColumna,

    // Setters
    setFiltroVacante,
    setFiltroScoreMin,
    setSelectedCandidato,
    setCvData,

    // Drag handlers
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    // Upload handlers
    handleFileChange,
    analizarCV,
    agregarCandidato,
    cerrarModalUpload,
    abrirModalUpload,

    // Multi-CV upload
    showMultiUploadModal,
    multiCVUpload,
    abrirModalMultiUpload,
    cerrarModalMultiUpload,
    agregarCandidatosMultiple,
  } = useKanbanBoard();

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Pipeline de Reclutamiento</h1>
          <p className="text-slate-500">Gestiona candidatos con análisis de IA</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={abrirModalUpload}
            disabled={loadingVacantes || vacantes.length === 0}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={vacantes.length === 0 ? 'No hay vacantes publicadas' : ''}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {loadingVacantes ? 'Cargando...' : 'Cargar 1 CV'}
          </button>
          <button
            onClick={abrirModalMultiUpload}
            disabled={loadingVacantes || vacantes.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={vacantes.length === 0 ? 'No hay vacantes publicadas' : ''}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="M9 15l3-3 3 3" />
            </svg>
            {loadingVacantes ? 'Cargando...' : 'Análisis Masivo'}
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <StatCard value={stats.total} label="Candidatos" />
          <StatCard value={`${stats.promedioScore}%`} label="Score Promedio" />
          <StatCard value={stats.altosMatch} label="Alto Match" accent />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Vacante:</label>
          <select
            value={filtroVacante}
            onChange={(e) => setFiltroVacante(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            disabled={loadingVacantes}
          >
            <option value="todas">
              {loadingVacantes ? 'Cargando vacantes...' : 'Todas las vacantes'}
            </option>
            {vacantes.map(v => (
              <option key={v.id} value={v.id}>{v.titulo}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Score mínimo:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={filtroScoreMin}
            onChange={(e) => setFiltroScoreMin(parseInt(e.target.value))}
            className="w-32 accent-blue-500"
          />
          <span className="text-sm text-slate-700 font-medium w-12">
            {filtroScoreMin}%
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map(columna => (
          <KanbanColumn
            key={columna.id}
            columna={columna}
            candidatos={getCandidatosPorColumna(columna.id)}
            isDropTarget={dragOverColumn === columna.id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onCardClick={setSelectedCandidato}
          />
        ))}
      </div>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        show={!!selectedCandidato}
        candidato={selectedCandidato}
        onClose={() => setSelectedCandidato(null)}
      />

      {/* CV Upload Modal */}
      <CVUploadModal
        show={showUploadModal}
        uploadStep={uploadStep}
        cvFile={cvFile}
        cvData={cvData}
        analysisResult={analysisResult}
        vacantes={vacantes}
        extractingData={extractingData}
        deepAnalysisLoading={deepAnalysisLoading}
        onFileChange={handleFileChange}
        onDataChange={setCvData}
        onAnalyze={analizarCV}
        onAddCandidate={agregarCandidato}
        onClose={cerrarModalUpload}
      />

      {/* Multi-CV Upload Modal */}
      <MultiCVUploadModal
        show={showMultiUploadModal}
        onClose={cerrarModalMultiUpload}
        vacantes={vacantes}
        onAddCandidates={agregarCandidatosMultiple}
        {...multiCVUpload}
      />
    </div>
  );
};

/**
 * Simple stat card component
 */
const StatCard = ({ value, label, accent }) => (
  <div className={`
    bg-white border rounded-xl px-4 py-2 text-center shadow-sm
    ${accent ? 'border-emerald-200' : 'border-slate-200'}
  `}>
    <span className={`block text-xl font-bold ${accent ? 'text-emerald-600' : 'text-slate-800'}`}>
      {value}
    </span>
    <span className="text-xs text-slate-500">{label}</span>
  </div>
);

export default KanbanBoard;
