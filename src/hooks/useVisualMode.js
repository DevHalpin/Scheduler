import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(mode, replace = false) {
    if (replace) {
      history.pop()
    }
    setMode(mode);
    setHistory(prev => [...prev, mode]);
  }

  const back = function () {
    if (history.length > 1) {
      history.pop()
    }
    setMode(history[history.length-1])
  }

  return { mode, transition, back };
}