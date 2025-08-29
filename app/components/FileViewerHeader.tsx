import { Form } from "react-router";

interface FileViewerHeaderProps {
  currentPath: string;
  parentPath: string | null;
  canGoUp: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function FileViewerHeader({ currentPath, parentPath, canGoUp, sortBy = "name", sortOrder = "asc", onSortChange }: FileViewerHeaderProps) {
  const handleSortChange = (newSortBy: string) => {
    if (!onSortChange) return;
    
    // Toggle sort order if clicking the same sort option
    const newSortOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    onSortChange(newSortBy, newSortOrder);
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">File Viewer</h1>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-600">Current path:</span>
        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
          {currentPath}
        </code>
      </div>
      
      {/* Sort controls */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange("name")}
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              sortBy === "name"
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortChange("type")}
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              sortBy === "type"
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortChange("date")}
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              sortBy === "date"
                ? "bg-blue-100 border-blue-300 text-blue-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Modified {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>
      
      {canGoUp && (
        <Form method="get">
          <input type="hidden" name="path" value={parentPath || ""} />
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