import { useState, useEffect, useCallback, useRef } from "react";
import type { ClientDirectoryItem, PaginatedClientDirectoryData } from "../types/clientTypes";

interface UseInfiniteScrollOptions {
  initialData: PaginatedClientDirectoryData;
  currentPath: string;
  limit?: number;
}

interface UseInfiniteScrollReturn {
  items: ClientDirectoryItem[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  setTargetRef: (node: HTMLDivElement | null) => void;
}

export function useInfiniteScroll({
  initialData,
  currentPath,
  limit = 50
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [items, setItems] = useState<ClientDirectoryItem[]>(initialData.items);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [offset, setOffset] = useState(initialData.offset + initialData.items.length);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  // Reset state when path changes
  useEffect(() => {
    setItems(initialData.items);
    setHasMore(initialData.hasMore);
    setOffset(initialData.offset + initialData.items.length);
    setLoading(false);
  }, [currentPath, initialData.items, initialData.hasMore, initialData.offset]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    console.log('Loading more items...', { currentPath, offset, limit });
    setLoading(true);
    
    try {
      const response = await fetch(
        `/api/directory-pagination?path=${encodeURIComponent(currentPath)}&offset=${offset}&limit=${limit}`,
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
  }, [currentPath, offset, limit, loading, hasMore]);

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
    setTargetRef
  };
}