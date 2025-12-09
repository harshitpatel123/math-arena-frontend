export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p className="text-xl font-semibold text-gray-800">Loading...</p>
      </div>
    </div>
  );
}
