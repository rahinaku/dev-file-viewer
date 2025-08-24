export function EmptyDirectoryView() {
  return (
    <div className="text-center py-12">
      <svg 
        className="w-16 h-16 text-gray-300 mx-auto mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1} 
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Empty Directory</h3>
      <p className="text-gray-500">This directory contains no files or folders.</p>
    </div>
  );
}