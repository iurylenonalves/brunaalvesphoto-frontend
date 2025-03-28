const Loader = () => {
  return (
    <div className="text-center py-10">
      <div className="animate-spin h-12 w-12 border-4 border-gray-900 border-t-transparent rounded-full mx-auto"></div>
      <p className="text-gray-700 mt-4">Carregando imagens...</p>
    </div>
  );
};

export default Loader;
