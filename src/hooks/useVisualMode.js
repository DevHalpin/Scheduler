import { useState } from 'react';

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = function(mode, replace = false) {
    if (replace) {
      setHistory(prev => [...prev.slice(0, -1), mode]);
    } else {
      setHistory(prev => [...prev, mode]);
    }
  }

  const back = function () {
    setHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1)
      }
      return prev
    })
  }

  return { mode: history[history.length -1], transition, back };
}