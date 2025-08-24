import { Form } from "react-router";

interface FileViewerHeaderProps {
  currentPath: string;
  parentPath: string;
  canGoUp: boolean;
}

export function FileViewerHeader({ currentPath, parentPath, canGoUp }: FileViewerHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">File Viewer</h1>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-600">Current path:</span>
        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
          {currentPath}
        </code>
      </div>
      
      {canGoUp && (
        <Form method="get">
          <input type="hidden" name="path" value={parentPath} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>←</span>
            Up to Parent Directory
          </button>
        </Form>
      )}
    </div>
  );
}