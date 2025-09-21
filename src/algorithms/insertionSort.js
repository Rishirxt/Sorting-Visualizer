export const insertionSort = async (
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
  
  // Mark first element as sorted
  setSortedIndices([0]);
  
  for (let i = 1; i < n && sortingRef.current; i++) {
    let key = arr[i];
    let j = i - 1;
    
    // Check if paused
    while (pausedRef.current && sortingRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!sortingRef.current) break;
    
    // Highlight the current indices being compared
    setActiveIndices([i, j]);
    
    // Wait for a bit to visualize
    await new Promise(resolve => setTimeout(resolve, speed));
    
    while (j >= 0 && arr[j] > key && sortingRef.current) {
      // Check if paused
      while (pausedRef.current && sortingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!sortingRef.current) break;
      
      arr[j + 1] = arr[j];
      j = j - 1;
      
      // Update array and highlight
      setArray([...arr]);
      setActiveIndices([j + 1, j + 2]);
      
      // Wait for a bit to visualize
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    arr[j + 1] = key;
    setArray([...arr]);
    
    // Mark current element as sorted
    setSortedIndices(prev => [...prev, i]);
    
    // Wait for a bit to visualize
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  
  if (sortingRef.current) {
    // Mark all as sorted when done
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  }
};