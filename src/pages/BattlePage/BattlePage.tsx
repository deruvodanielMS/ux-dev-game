import React, { useReducer, useEffect, useState } from 'react';
import styles from './BattlePage.module.css';
import PlayerHUD from '../../components/organisms/PlayerHUD/PlayerHUD';
import EnemyHUD from '../../components/organisms/EnemyHUD/EnemyHUD';
import CardHand from '../../components/organisms/CardHand/CardHand';
import enemies from '../../data/enemies.json';
import { usePlayer } from '../../context/PlayerContext';
import Button from '../../components/atoms/Button/Button';
import PlayerCard from '../../components/molecules/PlayerCard/PlayerCard';
import { useNavigate } from 'react-router-dom';

type State = {
  playerHealth: number;
  playerStamina: number;
  enemyHealth: number;
  enemyStamina: number;
  playerTurn: boolean;
  playerHand: string[];
  battleLog: string[];
};

type Action =
  | { type: 'PLAY_CARD'; card: string }
  | { type: 'ENEMY_ATTACK' }
  | { type: 'RESET' };

const initialState = (enemyHealth: number): State => ({
  playerHealth: 100,
  playerStamina: 100,
  enemyHealth,
  enemyStamina: 100,
  playerTurn: true,
  playerHand: ['code-review', 'bug-fix', 'refactor'],
  battleLog: [],
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'PLAY_CARD': {
      if (!state.playerTurn) return state;
      let enemyDamage = 0;
      let staminaCost = 0;
      let log = '';
      switch (action.card) {
        case 'code-review':
          staminaCost = 10;
          // heal player
          const healed = Math.min(100, state.playerHealth + 12);
          log = `Usaste Code Review y recuperaste ${healed - state.playerHealth} HP.`;
          return { ...state, playerHealth: healed, playerStamina: Math.max(0, state.playerStamina - staminaCost), playerTurn: false, battleLog: [log, ...state.battleLog] };
        case 'bug-fix':
          staminaCost = 18;
          enemyDamage = 20;
          log = `Usaste Bug Fix (costó ${staminaCost} stamina) y causaste ${enemyDamage} de daño.`;
          return { ...state, enemyHealth: Math.max(0, state.enemyHealth - enemyDamage), playerStamina: Math.max(0, state.playerStamina - staminaCost), playerTurn: false, battleLog: [log, ...state.battleLog] };
        case 'refactor':
          staminaCost = 14;
          enemyDamage = 14;
          log = `Usaste Refactor (costó ${staminaCost} stamina) y causaste ${enemyDamage} de daño.`;
          return { ...state, enemyHealth: Math.max(0, state.enemyHealth - enemyDamage), playerStamina: Math.max(0, state.playerStamina - staminaCost), playerTurn: false, battleLog: [log, ...state.battleLog] };
        default:
          return state;
      }
    }
    case 'ENEMY_ATTACK': {
      // simple fixed attack reduces player health and stamina
      const dmg = 10;
      const st = 8;
      const newPlayerHp = Math.max(0, state.playerHealth - dmg);
      const newPlayerSt = Math.max(0, state.playerStamina - st);
      const log = `El enemigo atacó y causó ${dmg} de daño.`;
      return { ...state, playerHealth: newPlayerHp, playerStamina: newPlayerSt, playerTurn: true, battleLog: [log, ...state.battleLog] };
    }
    case 'RESET':
      return initialState(50);
    default:
      return state;
  }
}

export default function BattlePage(){
  const { state: player } = usePlayer();
  const enemy = (enemies as any[])[0];
  const [s, dispatch] = useReducer(reducer, initialState(enemy.stats.health));

  const handlePlay = (card: string) => {
    dispatch({ type: 'PLAY_CARD', card });
    // enemy responds after a short delay
    setTimeout(() => dispatch({ type: 'ENEMY_ATTACK' }), 700);
  };

  return (
    <div className={styles.page}>
      <div className={styles.arena}>
        <div className={styles.side}>
          <PlayerCard name={player.playerName || 'Jugador'} avatarUrl={player.avatarUrl} level={player.level} health={s.playerHealth} stamina={s.playerStamina} isActive={s.playerTurn} />
        </div>

        <div className={styles.side}>
          <PlayerCard variant="enemy" name={enemy.name} avatarUrl={enemy.avatar_url} level={1} health={s.enemyHealth} stamina={s.enemyStamina} isActive={!s.playerTurn} />
        </div>

        <div className={styles.cardsArea}>
          <CardHand cards={s.playerHand} onPlay={handlePlay} />
        </div>

        <div className={styles.log}>
          <h4>Registro</h4>
          <ul>
            {s.battleLog.map((l, i) => (<li key={i}>{l}</li>))}
          </ul>
        </div>

        <div className={styles.controls}>
          <Button onClick={() => dispatch({ type: 'RESET' })} ariaLabel="Reiniciar">Reiniciar</Button>
        </div>
      </div>
    </div>
  );
}
