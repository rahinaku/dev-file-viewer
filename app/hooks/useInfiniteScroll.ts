import { useState, useEffect, useCallback, useRef } from "react";
import type { ClientDirectoryItem, PaginatedClientDirectoryData } from "../types/clientTypes";

interface UseInfiniteScrollOptions {
  initialData: PaginatedClientDirectoryData;
  currentPath: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

interface UseInfiniteScrollReturn {
  items: ClientDirectoryItem[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  setTargetRef: (node: HTMLDivElement | null) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function useInfiniteScroll({
  initialData,
  currentPath,
  limit = 50,
  sortBy: initialSortBy = "name",
  sortOrder: initialSortOrder = "asc",
  onSortChange
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [items, setItems] = useState<ClientDirectoryItem[]>(initialData.items);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [offset, setOffset] = useState(initialData.offset + initialData.items.length);
  const [sortBy, setSortBy] = useState(initialData.sortBy || initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialData.sortOrder || initialSortOrder);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  // Reset state when path or sort changes
  useEffect(() => {
    setItems(initialData.items);
    setHasMore(initialData.hasMore);
    setOffset(initialData.offset + initialData.items.length);
    setSortBy(initialData.sortBy || initialSortBy);
    setSortOrder(initialData.sortOrder || initialSortOrder);
    setLoading(false);
  }, [currentPath, initialData.items, initialData.hasMore, initialData.offset, initialData.sortBy, initialData.sortOrder, initialSortBy, initialSortOrder]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    console.log('Loading more items...', { currentPath, offset, limit, sortBy, sortOrder });
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        path: currentPath,
        offset: offset.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      const response = await fetch(
        `/api/directory-pagination?${params}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to load more files');
      }
      
      const newData: PaginatedClientDirectoryData = await response.json();
      
      setItems(prev => [...prev, ...newData.items]);
      setHasMore(newData.hasMore);
      setOffset(prev => prev + newData.items.length);
      
    } catch (error) {
      console.error('Error loading more files:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPath, offset, limit, loading, hasMore, sortBy, sortOrder]);

  const handleSortChange = useCallback(async (newSortBy: string, newSortOrder: "asc" | "desc") => {
    console.log('Sort change requested:', { newSortBy, newSortOrder });
    
    if (onSortChange) {
      onSortChange(newSortBy, newSortOrder);
    } else {
      // Reload data with new sort parameters
      setLoading(true);
      try {
        const params = new URLSearchParams({
          path: currentPath,
          sortBy: newSortBy,
          sortOrder: newSortOrder
        });
        
        window.location.href = `/?${params}`;
      } catch (error) {
        console.error('Error changing sort:', error);
        setLoading(false);
      }
    }
  }, [currentPath, onSortChange]);

  const setTargetRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      const entry = entries[0];
      console.log('Intersection observed:', { isIntersecting: entry.isIntersecting, hasMore, loading });
      if (entry.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, {
      threshold: 0.1,
      rootMargin: '200px'
    });
    
    if (node) observer.current.observe(node);
    targetRef.current = node;
  }, [loadMore, loading, hasMore]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    setTargetRef,
    sortBy,
    sortOrder,
    handleSortChange
  };
}