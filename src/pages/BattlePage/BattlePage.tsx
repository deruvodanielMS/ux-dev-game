import React, { useReducer } from 'react';
import styles from './BattlePage.module.css';
import PlayerHUD from '../../components/organisms/PlayerHUD/PlayerHUD';
import EnemyHUD from '../../components/organisms/EnemyHUD/EnemyHUD';
import CardHand from '../../components/organisms/CardHand/CardHand';
import enemies from '../../data/enemies.json';
import { usePlayer } from '../../context/PlayerContext';
import Button from '../../components/atoms/Button/Button';

type State = {
  playerHealth: number;
  enemyHealth: number;
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
  enemyHealth,
  playerTurn: true,
  playerHand: ['code-review', 'bug-fix', 'refactor'],
  battleLog: [],
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'PLAY_CARD': {
      if (!state.playerTurn) return state;
      let enemyDamage = 0;
      let log = '';
      switch (action.card) {
        case 'code-review':
          // heal player
          const healed = Math.min(100, state.playerHealth + 12);
          log = `Usaste Code Review y recuperaste ${healed - state.playerHealth} HP.`;
          return { ...state, playerHealth: healed, playerTurn: false, battleLog: [log, ...state.battleLog] };
        case 'bug-fix':
          enemyDamage = 20;
          log = `Usaste Bug Fix y causaste ${enemyDamage} de daño.`;
          return { ...state, enemyHealth: Math.max(0, state.enemyHealth - enemyDamage), playerTurn: false, battleLog: [log, ...state.battleLog] };
        case 'refactor':
          enemyDamage = 14;
          log = `Usaste Refactor y causaste ${enemyDamage} de daño.`;
          return { ...state, enemyHealth: Math.max(0, state.enemyHealth - enemyDamage), playerTurn: false, battleLog: [log, ...state.battleLog] };
        default:
          return state;
      }
    }
    case 'ENEMY_ATTACK': {
      // simple fixed attack
      const dmg = 10;
      const newPlayerHp = Math.max(0, state.playerHealth - dmg);
      const log = `El enemigo atacó y causó ${dmg} de daño.`;
      return { ...state, playerHealth: newPlayerHp, playerTurn: true, battleLog: [log, ...state.battleLog] };
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
        <PlayerHUD name={player.playerName || 'Jugador'} avatarUrl={player.avatarUrl} health={s.playerHealth} />
        <EnemyHUD name={enemy.name} avatarUrl={enemy.avatar_url} health={s.enemyHealth} />

        <CardHand cards={s.playerHand} onPlay={handlePlay} />

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
