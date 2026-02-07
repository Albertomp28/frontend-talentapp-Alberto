import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-8xl font-bold text-[#58a6ff] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-2">Página no encontrada</h2>
      <p className="text-[#8b949e] mb-8">La página que buscas no existe o ha sido movida.</p>
      <Link
        to="/dashboard"
        className="bg-[#238636] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2ea043] transition-colors"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
