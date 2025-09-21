const merge = async (
  arr,
  setArray,
  left,
  mid,
  right,
  pausedRef,
  speed,
  setActiveIndices,
  sortingRef
) => {
  let n1 = mid - left + 1;
  let n2 = right - mid;
  
  // Create temp arrays
  let L = new Array(n1);
  let R = new Array(n2);
  
  // Copy data to temp arrays L[] and R[]
  for (let i = 0; i < n1 && sortingRef.current; i++) {
    L[i] = arr[left + i];
  }
  for (let j = 0; j < n2 && sortingRef.current; j++) {
    R[j] = arr[mid + 1 + j];
  }
  
  // Merge the temp arrays back into arr[left..right]
  let i = 0;
  let j = 0;
  let k = left;
  
  while (i < n1 && j < n2 && sortingRef.current) {
    // Check if paused
    while (pausedRef.current && sortingRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!sortingRef.current) break;
    
    // Highlight the current indices being compared
    setActiveIndices([left + i, mid + 1 + j]);
    
    // Wait for a bit to visualize
    await new Promise(resolve => setTimeout(resolve, speed));
    
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    
    setArray([...arr]);
    k++;
    
    // Wait for a bit to visualize
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  
  // Copy the remaining elements of L[], if there are any
  while (i < n1 && sortingRef.current) {
    arr[k] = L[i];
    i++;
    k++;
    setArray([...arr]);
    
    // Wait for a bit to visualize
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  
  // Copy the remaining elements of R[], if there are any
  while (j < n2 && sortingRef.current) {
    arr[k] = R[j];
    j++;
    k++;
    setArray([...arr]);
    
    // Wait for a bit to visualize
    await new Promise(resolve => setTimeout(resolve, speed));
  }
};

const mergeSortHelper = async (
  arr,
  setArray,
  left,
  right,
  pausedRef,
  speed,
  setActiveIndices,
  setSortedIndices,
  sortingRef
) => {
  if (left < right && sortingRef.current) {
    // Check if paused
    while (pausedRef.current && sortingRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!sortingRef.current) return;
    
    let mid = Math.floor(left + (right - left) / 2);
    
    // Sort first and second halves
    await mergeSortHelper(
      arr,
      setArray,
      left,
      mid,
      pausedRef,
      speed,
      setActiveIndices,
      setSortedIndices,
      sortingRef
    );
    
    await mergeSortHelper(
      arr,
      setArray,
      mid + 1,
      right,
      pausedRef,
      speed,
      setActiveIndices,
      setSortedIndices,
      sortingRef
    );
    
    // Merge the sorted halves
    await merge(
      arr,
      setArray,
      left,
      mid,
      right,
      pausedRef,
      speed,
      setActiveIndices,
      sortingRef
    );
    
    // Mark the merged segment as sorted
    for (let i = left; i <= right && sortingRef.current; i++) {
      setSortedIndices(prev => [...prev, i]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }
  }
};

export const mergeSort = async (
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
  
  await mergeSortHelper(
    arr,
    setArray,
    0,
    n - 1,
    pausedRef,
    speed,
    setActiveIndices,
    setSortedIndices,
    sortingRef
  );
  
  if (sortingRef.current) {
    // Mark all as sorted when done
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  }
};