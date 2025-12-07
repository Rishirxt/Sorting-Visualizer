export const bubbleSort = async (
  array,
  setArray,
  pausedRef,
  speed,
  setActiveIndices,
  setSortedIndices,
  sortingRef,
  setIsSorting
) => {
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 0; i < n - 1 && sortingRef.current; i++) {
    for (let j = 0; j < n - i - 1 && sortingRef.current; j++) {
      // Check if paused
      while (pausedRef.current && sortingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!sortingRef.current) break;
      
      // Highlight the current indices being compared
      setActiveIndices([j, j + 1]);
      
      // Wait for a bit to visualize
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]);
        
        // Wait for a bit to visualize the swap
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
    
    // Mark the last element as sorted
    setSortedIndices(prev => [...prev, n - i - 1]);
  }
  
  if (sortingRef.current) {
    // Mark all as sorted when done
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  }
};

