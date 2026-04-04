import { useState, useRef } from 'react';
import TornadoGame from './TornadoGame';

import api from '@/services/api';

/**
 * TornadoGameWrapper - Handles Tornado game playing state
 * This component is extracted from TornadoGameWrapper.jsx to separate concerns
 */
export default function TornadoWrapper({ config, players, onGameEnd, onBackToSetup, onExitToPortal, onWinner, selectedClass }) {
  const gameStateRef = useRef({
    scores: players.map(p => p.score || 0),
    currentPlayerIndex: 0
  });

  const [gameState, setGameState] = useState({
    scores: players.map(p => p.score || 0),
    currentPlayerIndex: 0
  });

  // Handle giving points to game winners
  const handleGivePoints = async (studentsArray, points = 1) => {
    if (!selectedClass || !selectedClass.students) return;

    const userEmail = JSON.parse(localStorage.getItem('classABC_logged_in') || '{}')?.email || 'anonymous';

    // Find the student objects in the class
    const studentsToUpdate = studentsArray.map(playerData => {
      return selectedClass.students.find(s => s.id === playerData.id);
    }).filter(s => s !== null);

    if (studentsToUpdate.length === 0) {
      return;
    }

    // Update each student's score and history
    const updatedStudents = selectedClass.students.map(student => {
      const shouldUpdate = studentsToUpdate.find(s => s.id === student.id);
      if (!shouldUpdate) return student;

      const historyEntry = {
        label: 'Game Winner',
        pts: points,
        type: 'wow',
        timestamp: new Date().toISOString()
      };

      return {
        ...student,
        score: (student.score || 0) + points,
        history: [...(student.history || []), historyEntry]
      };
    });

    // Update the class
    const updatedClass = {
      ...selectedClass,
      students: updatedStudents
    };

    // Save to backend
    try {
      await api.saveClasses(userEmail, [updatedClass]);
    } catch (error) {
    }
  };

  return (
    <TornadoGame
      gameConfig={config}
      players={players}
      onGameEnd={onGameEnd}
      onBackToSetup={onBackToSetup}
      onExitToPortal={onExitToPortal}
      gameStateRef={gameStateRef}
      setGameState={setGameState}
      onWinner={onWinner}
      onGivePoints={handleGivePoints}
    />
  );
}
