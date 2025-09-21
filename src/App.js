import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { bubbleSort } from "./algorithms/bubbleSort.js";
import { selectionSort } from "./algorithms/selectionSort";
import { insertionSort } from "./algorithms/insertionSort";
import { mergeSort } from "./algorithms/mergeSort";

const ARRAY_SIZE = 30;
const SPEED = 500; // ms delay for sorting steps

export default function App() {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const sortingRef = useRef(false); // To track if sorting is in progress for stop functionality

  const pausedRef = useRef(paused);

  useEffect(() => {
    generateArray();
    // eslint-disable-next-line
  }, []);

  const generateArray = () => {
    const arr = Array.from({ length: ARRAY_SIZE }, () =>
      Math.floor(Math.random() * 100) + 5
    );
    setArray(arr);
    setIsSorting(false);
    setPaused(false);
    setActiveIndices([]);
    setSortedIndices([]);
    pausedRef.current = false;
    sortingRef.current = false;
  };

  const togglePause = () => {
    setPaused((prev) => {
      const next = !prev;
      pausedRef.current = next;
      return next;
    });
  };

  const stopSorting = () => {
    sortingRef.current = false;
    setIsSorting(false);
    setPaused(false);
    pausedRef.current = false;
  };

  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    pausedRef.current = false;
    setPaused(false);
    setSortedIndices([]);
    sortingRef.current = true;

    // Create a copy of the sorting functions that accept additional parameters
    const sortingAlgorithms = {
      bubble: () => bubbleSort(
        array, 
        setArray, 
        pausedRef, 
        SPEED, 
        setActiveIndices, 
        setSortedIndices,
        sortingRef,
        setIsSorting
      ),
      selection: () => selectionSort(
        array, 
        setArray, 
        pausedRef, 
        SPEED, 
        setActiveIndices, 
        setSortedIndices,
        sortingRef,
        setIsSorting
      ),
      insertion: () => insertionSort(
        array, 
        setArray, 
        pausedRef, 
        SPEED, 
        setActiveIndices, 
        setSortedIndices,
        sortingRef,
        setIsSorting
      ),
      merge: () => mergeSort(
        array, 
        setArray, 
        pausedRef, 
        SPEED, 
        setActiveIndices, 
        setSortedIndices,
        sortingRef,
        setIsSorting
      ),
    };

    if (sortingAlgorithms[algorithm]) {
      await sortingAlgorithms[algorithm]();
    }

    // Only mark as sorted if sorting wasn't stopped
    if (sortingRef.current) {
      setSortedIndices(Array.from({ length: array.length }, (_, i) => i));
      setActiveIndices([]);
      setIsSorting(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Sorting Visualizer</h1>
        <p>Visualize how different sorting algorithms work</p>
      </header>

      {/* Algorithm Selection */}
      <div className="algorithm-selection">
        <h2>Select Algorithm</h2>
        <div className="algorithm-buttons">
          {[
            { id: "bubble", name: "Bubble Sort" },
            { id: "selection", name: "Selection Sort" },
            { id: "insertion", name: "Insertion Sort" },
            { id: "merge", name: "Merge Sort" }
          ].map((algo) => (
            <button
              key={algo.id}
              className={`algo-btn ${algorithm === algo.id ? "active" : ""}`}
              onClick={() => setAlgorithm(algo.id)}
              disabled={isSorting}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="visualization-container">
        <div className="bar-container">
          {array.map((value, idx) => {
            const isActive = activeIndices.includes(idx);
            const isSorted = sortedIndices.includes(idx);
            
            let barClass = "bar";
            if (isSorted) barClass += " sorted";
            if (isActive) barClass += " active";
            
            return (
              <div
                className={barClass}
                key={idx}
                style={{ height: `${value * 3}px` }}
              >
                <span className="bar-value">{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button 
          className="control-btn generate" 
          onClick={generateArray} 
          disabled={isSorting}
        >
          <span className="icon">🔄</span> Generate New Array
        </button>

        <button 
          className="control-btn start" 
          onClick={startSort} 
          disabled={isSorting}
        >
          <span className="icon">⚡</span> Start {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort
        </button>

        {isSorting && (
          <>
            <button 
              className={`control-btn ${paused ? "resume" : "pause"}`} 
              onClick={togglePause}
            >
              <span className="icon">{paused ? "▶️" : "⏸️"}</span> {paused ? "Resume" : "Pause"}
            </button>
            
            <button 
              className="control-btn stop" 
              onClick={stopSorting}
            >
              <span className="icon">⏹️</span> Stop
            </button>
          </>
        )}
      </div>

      {/* Status */}
      <div className="status">
        {isSorting ? (
          <div className="status-sorting">
            <span className="spinner"></span>
            Sorting using {algorithm} sort... {paused && "(Paused)"}
          </div>
        ) : (
          <div className="status-ready">
            {sortedIndices.length === array.length && array.length > 0 
              ? "Sorting completed!" 
              : "Ready to sort"}
          </div>
        )}
      </div>
    </div>
  );
}