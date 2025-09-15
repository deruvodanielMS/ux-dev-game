import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  BattleAction as Action,
  BattleState as State,
  Enemy,
} from '@/types/pages/battle';

import { Button } from '@/components/atoms/Button/Button';
import { DamageNumber } from '@/components/atoms/DamageNumber/DamageNumber';
import { TurnIndicator } from '@/components/atoms/TurnIndicator/TurnIndicator';
import { PlayerCard } from '@/components/molecules/PlayerCard/PlayerCard';
import { CardHand } from '@/components/organisms/CardHand/CardHand';

import { useAudio } from '@/context/AudioContext';
import { useGame } from '@/context/GameContext';
import enemies from '@/data/enemies.json';

import styles from './BattlePage.module.css';

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
        case 'code-review': {
          staminaCost = 10;
          // heal player
          const healed = Math.min(100, state.playerHealth + 12);
          log = `Usaste Code Review y recuperaste ${healed - state.playerHealth} HP.`;
          return {
            ...state,
            playerHealth: healed,
            playerStamina: Math.max(0, state.playerStamina - staminaCost),
            playerTurn: false,
            battleLog: [log, ...state.battleLog],
          };
        }
        case 'bug-fix': {
          staminaCost = 18;
          enemyDamage = 20;
          log = `Usaste Bug Fix (costó ${staminaCost} stamina) y causaste ${enemyDamage} de daño.`;
          return {
            ...state,
            enemyHealth: Math.max(0, state.enemyHealth - enemyDamage),
            playerStamina: Math.max(0, state.playerStamina - staminaCost),
            playerTurn: false,
            battleLog: [log, ...state.battleLog],
          };
        }
        case 'refactor': {
          staminaCost = 14;
          enemyDamage = 14;
          log = `Usaste Refactor (costó ${staminaCost} stamina) y causaste ${enemyDamage} de daño.`;
          return {
            ...state,
            enemyHealth: Math.max(0, state.enemyHealth - enemyDamage),
            playerStamina: Math.max(0, state.playerStamina - staminaCost),
            playerTurn: false,
            battleLog: [log, ...state.battleLog],
          };
        }
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
      return {
        ...state,
        playerHealth: newPlayerHp,
        playerStamina: newPlayerSt,
        playerTurn: true,
        battleLog: [log, ...state.battleLog],
      };
    }
    case 'REGEN': {
      const regen = 8;
      return {
        ...state,
        playerStamina: Math.min(100, state.playerStamina + regen),
        enemyStamina: Math.min(100, state.enemyStamina + regen),
        battleLog: [`Se regeneraron ${regen} de stamina.`, ...state.battleLog],
      };
    }
    case 'RESET':
      return initialState(50);
    default:
      return state;
  }
}

export const BattlePage = () => {
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const player = gameState.player;
  const enemy: Enemy = (enemies as unknown as Enemy[])[0];
  const [s, dispatch] = useReducer(reducer, initialState(enemy.stats.health));
  const navigate = useNavigate();
  const audio = useAudio();
  const [handledVictory, setHandledVictory] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<
    { id: string; value: number; top: number; left: number | string }[]
  >([]);

  // play battle music while this page is mounted
  React.useEffect(() => {
    const src =
      'https://cdn.builder.io/o/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2Fc4c10a69a33a4bbdb8bacc26bfcf1e26?alt=media&token=b7e21c32-d821-483d-b8a4-22eacf9f04d8&apiKey=18b71006d6404cecbe90ad5e2b850e0e';
    audio.setSource(src);
    // try to play; audio.play handles promise
    audio.play();
    return () => {
      audio.pause();
      audio.setSource(null);
    };
  }, [audio]);

  const handlePlay = (card: string) => {
    dispatch({ type: 'PLAY_CARD', card });
    // after playing, start enemy turn flow via effect
  };

  // Enemy turn flow and regen handling
  useEffect(() => {
    // handle regen at start of any turn change
    dispatch({ type: 'REGEN' });
  }, [s.playerTurn]);

  useEffect(() => {
    if (!s.playerTurn) {
      // enemy acts after a short delay
      const t = setTimeout(() => {
        // simple enemy action: attack when has stamina
        if (s.enemyStamina >= 8) {
          dispatch({ type: 'ENEMY_ATTACK' });
        } else {
          // enemy skips - regenerate next turn
          dispatch({ type: 'REGEN' });
          dispatch({ type: 'ENEMY_ATTACK' });
        }
      }, 900);
      return () => clearTimeout(t);
    }
  }, [s.playerTurn, s.enemyStamina]);

  // Victory detection
  useEffect(() => {
    if (s.enemyHealth <= 0 && !handledVictory) {
      setHandledVictory(true);
      // add to defeated list
      if (enemy.id)
        gameDispatch({ type: 'ADD_DEFEATED_ENEMY', payload: enemy.id });
      // small delay then navigate to progress map
      setTimeout(() => {
        const go = window.confirm(
          '¡Enemigo derrotado! ¿Ir al mapa de progreso?',
        );
        if (go) navigate('/progress');
      }, 500);
    }

    if (s.playerHealth <= 0) {
      // player defeat - visual handled by PlayerCard
      setTimeout(
        () => alert('Has sido derrotado... reiniciando batalla.'),
        600,
      );
      setTimeout(() => dispatch({ type: 'RESET' }), 1200);
    }
  }, [
    s.enemyHealth,
    handledVictory,
    enemy,
    navigate,
    s.playerHealth,
    gameDispatch,
  ]);

  // generate damage numbers when enemy health decreases
  const prevEnemyHp = React.useRef<number>(s.enemyHealth);
  useEffect(() => {
    const prev = prevEnemyHp.current;
    if (s.enemyHealth < prev) {
      const dmg = prev - s.enemyHealth;
      const id = String(Date.now());
      setDamageNumbers((ds) => [
        ...ds,
        { id, value: dmg, top: 80, left: '50%' },
      ]);
    }
    prevEnemyHp.current = s.enemyHealth;
  }, [s.enemyHealth]);

  // log auto-scroll
  const logRef = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [s.battleLog]);

  return (
    <div className={styles.page}>
      <div className={styles.arena}>
        <div className={styles.turnRow}>
          <TurnIndicator turn={s.playerTurn ? 'player' : 'enemy'} />
        </div>

        <div className={styles.side}>
          <PlayerCard
            name={player?.name || 'Jugador'}
            avatarUrl={player?.avatarUrl || null}
            level={player?.level || 1}
            health={s.playerHealth}
            stamina={s.playerStamina}
            isActive={s.playerTurn}
          />
        </div>

        <div className={styles.side}>
          <PlayerCard
            variant="enemy"
            name={enemy.name}
            avatarUrl={enemy.avatar_url}
            level={1}
            health={s.enemyHealth}
            stamina={s.enemyStamina}
            isActive={!s.playerTurn}
          />
        </div>

        <div className={styles.cardsArea}>
          <CardHand
            cards={s.playerHand}
            onPlay={(card) => {
              handlePlay(card);
            }}
          />
        </div>

        <div className={styles.log} ref={logRef}>
          <h4>Registro</h4>
          <ul>
            {s.battleLog.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>

        <div className={styles.controls}>
          <Button
            onClick={() => dispatch({ type: 'RESET' })}
            ariaLabel="Reiniciar"
          >
            Reiniciar
          </Button>
        </div>

        {/* Damage numbers overlay */}
        <div className={styles.damageLayer} aria-hidden>
          {damageNumbers.map((d) => (
            <DamageNumber
              key={d.id}
              id={d.id}
              value={d.value}
              onDone={(id) =>
                setDamageNumbers((arr) => arr.filter((x) => x.id !== id))
              }
              top={d.top}
              left={typeof d.left === 'number' ? d.left : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
