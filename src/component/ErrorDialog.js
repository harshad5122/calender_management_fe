const ErrorDialog = ({ errors, onClose }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-red-700">Errors</h2>
        <ul className="list-disc list-inside space-y-2 text-red-600 mb-6">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-2xl leading-none"
          aria-label="Close error dialog"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ErrorDialog;
