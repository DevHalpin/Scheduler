import { useState } from 'react';

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = function(mode, replace = false) {
   setHistory(prev => replace? [...prev.slice(0,-1), mode] : [...prev, mode]);
  }

  const back = function () {
    setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }

  return { mode: history[history.length -1], transition, back };
}
