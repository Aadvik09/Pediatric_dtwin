// Pure battle logic for the HealthQuest RPG.
import { TYPE_CHART, type Buddy, type Move, type MoveType } from '../data/rpg';

export interface Combatant {
  id: string;
  buddy: Buddy;
  level: number;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  shielded: number; // turns of shield remaining
  stunned: boolean;
}

export interface BattleState {
  player: Combatant;
  enemy: Combatant;
  log: string[];
  turn: 'player' | 'enemy';
  phase: 'fighting' | 'won' | 'lost';
  enemyTeam: Combatant[];
  enemyIndex: number;
  reward: number;
  enemyName: string;
  enemyEmoji: string;
  dialogue: string;
  defeatLine: string;
}

export function makeCombatant(buddy: Buddy, level: number): Combatant {
  const scale = 1 + (level - 1) * 0.15;
  return {
    id: `${buddy.id}-${level}-${Math.random().toString(36).slice(2, 6)}`,
    buddy,
    level,
    maxHp: Math.round(buddy.base.hp * scale),
    hp: Math.round(buddy.base.hp * scale),
    atk: Math.round(buddy.base.atk * scale),
    def: Math.round(buddy.base.def * scale),
    spd: buddy.base.spd,
    shielded: 0,
    stunned: false,
  };
}

export function typeMultiplier(attack: MoveType, defend: MoveType): number {
  return TYPE_CHART[attack]?.[defend] ?? 1;
}

function effLabel(mult: number): string {
  if (mult > 1) return "It's super effective!";
  if (mult < 1) return "It's not very effective…";
  return '';
}

export function doMove(
  state: BattleState,
  move: Move,
  attackerSide: 'player' | 'enemy',
): BattleState {
  if (state.phase !== 'fighting') return state;
  const attacker = attackerSide === 'player' ? state.player : state.enemy;
  const defender = attackerSide === 'player' ? state.enemy : state.player;
  if (attacker.stunned) {
    return {
      ...state,
      log: [`${attacker.buddy.name} is stunned and skips a turn!`, ...state.log].slice(0, 8),
      turn: attackerSide === 'player' ? 'enemy' : 'player',
    };
  }

  const log: string[] = [`${attacker.buddy.name} used ${move.name}!`];
  let player = { ...state.player };
  let enemy = { ...state.enemy };

  if (move.effect === 'heal') {
    const healed = attackerSide === 'player' ? player : enemy;
    healed.hp = Math.min(healed.maxHp, healed.hp + 30);
    log.push(`${healed.buddy.name} recovered 30 HP!`);
  } else if (move.effect === 'shield') {
    const buffed = attackerSide === 'player' ? player : enemy;
    buffed.shielded = 3;
    log.push(`${buffed.buddy.name} raised its defense!`);
  } else {
    const def = defender;
    const mult = typeMultiplier(move.type, def.buddy.type);
    const dmg = Math.max(4, Math.round((move.power + attacker.atk * 0.6 - def.def * 0.5) * mult * (0.85 + Math.random() * 0.3)));
    def.hp = Math.max(0, def.hp - (def.shielded > 0 ? Math.round(dmg * 0.5) : dmg));
    const eff = effLabel(mult);
    if (eff) log.push(eff);
    log.push(`${def.buddy.name} took ${dmg} damage!`);
    if (move.effect === 'stun' && Math.random() < 0.4) {
      def.stunned = true;
      log.push(`${def.buddy.name} is stunned!`);
    } else {
      def.stunned = false;
    }
    if (def.shielded > 0) def.shielded -= 1;
  }

  // Check faint / next enemy
  let phase: BattleState['phase'] = state.phase;
  let enemyIndex = state.enemyIndex;
  let enemyTeam = [...state.enemyTeam];
  let reward = state.reward;

  if (enemy.hp <= 0 && enemyIndex < enemyTeam.length - 1) {
    enemyIndex += 1;
    enemy = { ...enemyTeam[enemyIndex] };
    log.push(`${state.enemyName} sent out ${enemy.buddy.name}!`);
  } else if (enemy.hp <= 0) {
    phase = 'won';
    log.push(`You beat ${state.enemyName}! ${state.defeatLine}`);
    log.push(`+${reward} coins!`);
  } else if (player.hp <= 0) {
    phase = 'lost';
    log.push(`${player.buddy.name} fainted! You lost the battle…`);
  }

  const next: BattleState = {
    ...state, player, enemy, log: [...log, ...state.log].slice(0, 10),
    turn: attackerSide === 'player' ? 'enemy' : 'player',
    phase, enemyIndex, enemyTeam, reward,
  };
  return next;
}

export function enemyChooseMove(enemy: Combatant): Move {
  const moves = enemy.buddy.moves;
  // Prefer damaging moves; sometimes heal if low
  if (enemy.hp < enemy.maxHp * 0.3 && moves.some((m) => m.effect === 'heal')) {
    return moves.find((m) => m.effect === 'heal')!;
  }
  const dmg = moves.filter((m) => m.power > 0);
  if (dmg.length === 0) return moves[0];
  return dmg[Math.floor(Math.random() * dmg.length)];
}
