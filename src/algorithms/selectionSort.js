export const selectionSort = async (
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
    let minIndex = i;
    
    for (let j = i + 1; j < n && sortingRef.current; j++) {
      // Check if paused
      while (pausedRef.current && sortingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!sortingRef.current) break;
      
      // Highlight the current indices being compared
      setActiveIndices([minIndex, j]);
      
      // Wait for a bit to visualize
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i && sortingRef.current) {
      // Swap elements
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      setArray([...arr]);
      
      // Wait for a bit to visualize the swap
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    // Mark the current element as sorted
    setSortedIndices(prev => [...prev, i]);
  }
  
  if (sortingRef.current) {
    // Mark all as sorted when done
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  }
};