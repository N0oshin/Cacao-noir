import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Phaser from 'phaser';
import './SnakesLadders.css';

/* ── Board constants ─────────────────────────────── */
const BOARD_SIZE = 10;
const CELL_SIZE = 56;
const BOARD_PX = BOARD_SIZE * CELL_SIZE; // 560

/* ── Snakes: { head: tail } ──────────────────────── */
const SNAKES = { 98: 64, 87: 36, 62: 19, 54: 34, 17: 7 };

/* ── Ladders: { foot: top } ───────────────────────── */
const LADDERS = {
  4: { top: 14 },
  9: { top: 31 },
  20: { top: 38 },
  28: { top: 84 },
  40: { top: 59 },
};

const ALL_REWARDS = [
  { code: 'SAMPLE', label: 'Free Sample Chocolate on next purchase! 🍫' },
  { code: 'NOIR10', label: '10% Off on your next purchase! 🎁' },
  { code: 'NOIR05', label: '5% Off on your next purchase! 🍪' },
  { code: 'NOIR20', label: '20% Off on your next purchase! 🥇' },
  { code: 'CHOCFREE', label: 'Free Chocolate Box with any order! 📦' }
];

const PLAYER_COLORS = ['#f0c060'];
const PLAYER_NAMES = ['Player 1'];

/* ── Cell → canvas position ──────────────────────── */
function cellToXY(cell) {
  const idx = cell - 1;
  const row = Math.floor(idx / BOARD_SIZE);           // 0 = bottom row
  const col = idx % BOARD_SIZE;
  const screenRow = BOARD_SIZE - 1 - row;
  const x = (row % 2 === 0 ? col : BOARD_SIZE - 1 - col) * CELL_SIZE + CELL_SIZE / 2;
  const y = screenRow * CELL_SIZE + CELL_SIZE / 2;
  return { x, y };
}

/* ── Phaser Scene ─────────────────────────────────── */
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.positions = [1];
    this.turn = 0;
    this.rolling = false;
    this.onRollDone = null;
  }

  create() {
    console.log("PHASER: Scene create starting");
    this.drawBoard();
    this.drawSnakesAndLadders();

    // Create tokens with shadows
    this.tokens = this.positions.map((pos, i) => {
      const { x, y } = cellToXY(pos);

      // Shadow
      this.add.circle(x + 2, y + 2, 14, 0x000000, 0.4).setDepth(9);

      const colorNum = Phaser.Display.Color.HexStringToColor(PLAYER_COLORS[i]).color;
      let circle = this.add.circle(x, y, 14, colorNum);
      if (circle) {
        circle.setStrokeStyle(3, 0xffffff, 0.8);
        circle.setDepth(10);
      }
      return circle;
    });
  }

  drawBoard() {
    const g = this.add.graphics();
    for (let cell = 1; cell <= 100; cell++) {
      const { x, y } = cellToXY(cell);
      const cx = x - CELL_SIZE / 2;
      const cy = y - CELL_SIZE / 2;
      const isDark = (Math.floor((cell - 1) / BOARD_SIZE) + ((cell - 1) % BOARD_SIZE)) % 2 === 0;

      const c1 = isDark ? 0x2d1200 : 0x1a0a00;
      const c2 = isDark ? 0x1a0a00 : 0x0d0500;

      g.fillGradientStyle(c1, c1, c2, c2, 1, 1, 1, 1);
      g.fillRect(cx, cy, CELL_SIZE, CELL_SIZE);
      g.lineStyle(1, 0x8b6420, 0.2);
      g.strokeRect(cx, cy, CELL_SIZE, CELL_SIZE);

      // Snake head indicator
      if (SNAKES[cell]) {
        this.add.text(cx + CELL_SIZE / 2, cy + CELL_SIZE / 2, '🐍', {
          fontSize: '18px', resolution: 2,
        }).setOrigin(0.5).setDepth(5);
      }
      // Ladder top indicator (Mystery Reward)
      const isMystery = (cell === 38 || cell === 84);
      if (isMystery) {
        const qText = this.add.text(cx + CELL_SIZE / 2, cy + CELL_SIZE / 2, '?', {
          fontSize: '36px',
          fontStyle: 'bold',
          color: '#f7dfa0',
          stroke: '#8b6420',
          strokeThickness: 2,
          shadow: {
            offsetX: 0,
            offsetY: 0,
            color: '#f0c060',
            blur: 15,
            stroke: true,
            fill: true
          },
          resolution: 2,
        }).setOrigin(0.5).setDepth(5);

        // Bouncing animation
        this.tweens.add({
          targets: qText,
          y: qText.y - 12,
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Cubic.easeInOut'
        });
      }

      // Victory Goal
      if (cell === 100) {
        const choc = this.add.text(cx + CELL_SIZE / 2, cy + CELL_SIZE / 2, '🍫', {
          fontSize: '40px',
          shadow: { offsetX: 0, offsetY: 0, color: '#f0c060', blur: 15, fill: true },
          resolution: 2,
        }).setOrigin(0.5).setDepth(5);

        this.tweens.add({
          targets: choc,
          scale: 1.2,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

      // Cell number
      const isFinish = cell === 100;
      this.add.text(cx + 4, cy + 3, String(cell), {
        fontSize: isFinish ? '12px' : '9px',
        color: isFinish ? '#f0c060' : '#8b6420',
        fontFamily: 'Montserrat',
        fontStyle: isFinish ? 'bold' : 'normal',
      }).setDepth(6);
    }
  }

  drawSnakesAndLadders() {
    const g = this.add.graphics();

    // Draw snakes (Curved Bezier bodies)
    Object.entries(SNAKES).forEach(([head, tail]) => {
      const h = cellToXY(Number(head));
      const t = cellToXY(Number(tail));

      // Body Shadow
      let ctrlX = (h.x + t.x) / 2 + (h.y - t.y) * 0.4;
      let ctrlY = (h.y + t.y) / 2 + (t.x - h.x) * 0.4;

      const shadowCurve = new Phaser.Curves.QuadraticBezier(
        new Phaser.Math.Vector2(h.x + 2, h.y + 2),
        new Phaser.Math.Vector2(ctrlX + 2, ctrlY + 2),
        new Phaser.Math.Vector2(t.x + 2, t.y + 2)
      );
      g.lineStyle(6, 0x000000, 0.3);
      shadowCurve.draw(g);

      const snakeCurve = new Phaser.Curves.QuadraticBezier(
        new Phaser.Math.Vector2(h.x, h.y),
        new Phaser.Math.Vector2(ctrlX, ctrlY),
        new Phaser.Math.Vector2(t.x, t.y)
      );

      // Draw tapered body
      const segments = 40;
      for (let i = 0; i <= segments; i++) {
        const tVal = i / segments;
        const pt = snakeCurve.getPoint(tVal);
        const radius = 6 * (1 - tVal * 0.8); // Tapering
        const color = i % 4 === 0 ? 0x228822 : 0x116611; // Scales pattern (Green)

        g.fillStyle(color, 1);
        g.fillCircle(pt.x, pt.y, radius);
      }

      // Draw Head
      g.fillStyle(0x228822, 1);
      g.fillEllipse(h.x, h.y, 14, 10);

      // Eyes
      g.fillStyle(0xffffff, 1);
      g.fillCircle(h.x - 3, h.y - 2, 2);
      g.fillCircle(h.x + 3, h.y - 2, 2);
      g.fillStyle(0x000000, 1);
      g.fillCircle(h.x - 3, h.y - 2, 1);
      g.fillCircle(h.x + 3, h.y - 2, 1);

      g.setDepth(4);
    });

    // Draw ladders (Clean symmetrical rails)
    Object.entries(LADDERS).forEach(([foot, { top }]) => {
      const f = cellToXY(Number(foot));
      const t = cellToXY(Number(top));
      const color = 0xf0c060;

      g.lineStyle(4, 0x0d0500, 0.4); // Rail shadows
      g.lineBetween(f.x - 7, f.y + 2, t.x - 7, t.y + 2);
      g.lineBetween(f.x + 7, f.y + 2, t.x + 7, t.y + 2);

      g.lineStyle(3, color, 0.9);
      g.lineBetween(f.x - 8, f.y, t.x - 8, t.y);
      g.lineBetween(f.x + 8, f.y, t.x + 8, t.y);

      // Rungs
      const steps = 6;
      for (let i = 1; i < steps; i++) {
        const px = f.x + (t.x - f.x) * (i / steps);
        const py = f.y + (t.y - f.y) * (i / steps);
        g.lineBetween(px - 8, py, px + 8, py);
      }
      g.setDepth(3);
    });
  }

  moveToken(playerIdx, from, to, callback) {
    const steps = to > from ? 1 : -1;         // always walk forward here
    let current = from;

    const walk = () => {
      if (current === to) { callback(); return; }
      current += steps;
      const { x, y } = cellToXY(current);
      this.tweens.add({
        targets: this.tokens[playerIdx],
        x, y,
        duration: 100,
        ease: 'Power1',
        onComplete: walk,
      });
    };
    walk();
  }
}

/* ── React Wrapper ───────────────────────────────── */
export default function SnakesLadders() {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);

  const [positions, setPositions] = useState([1]);
  const [turn, setTurn] = useState(0);
  const [lastDice, setLastDice] = useState(null);
  const navigate = useNavigate();
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [reward, setReward] = useState(null);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [rollsRemaining, setRollsRemaining] = useState(0);
  const [turns, setTurns] = useState(0);
  const [copied, setCopied] = useState('');
  const [playerNames, setPlayerNames] = useState(['Player 1']);
  const [nameInput, setNameInput] = useState(['Player 1']);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gameInitialized = useRef(false);

  /* Init Phaser */
  useEffect(() => {
    if (!started || !mountRef.current) return;

    console.log("PHASER: Init triggered");

    const initGame = () => {
      if (!mountRef.current) return;
      const config = {
        type: Phaser.AUTO, // Use AUTO for gradients, relies on robust unmount fix
        width: BOARD_PX,
        height: BOARD_PX,
        backgroundColor: '#0d0500',
        parent: mountRef.current,
        scene: GameScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        render: { pixelArt: false, antialias: true, transparent: false }
      };

      console.log("PHASER: Creating game instance", config);
      const game = new Phaser.Game(config);
      gameRef.current = game;

      game.events.once('ready', () => {
        console.log("PHASER: Game ready event fired");
        sceneRef.current = game.scene.getScene('GameScene');
        if (sceneRef.current && sceneRef.current.tokens) {
          sceneRef.current.tokens.forEach((t, i) => {
            const { x, y } = cellToXY(positions[i] || 1);
            t.setPosition(x, y);
          });
        }
      });
    };

    const timer = setTimeout(initGame, 50);

    return () => {
      clearTimeout(timer);
      if (gameRef.current) {
        console.log("PHASER: Destroying game instance");
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, [started]);

  /* Roll dice */
  const rollDice = () => {
    if (rolling || winner || !started || isRollingDice || rollsRemaining <= 0 || reward) return;
    setIsRollingDice(true);

    const finalizeRoll = () => {
      setIsRollingDice(false);
      setRolling(true);

      const dice = Math.ceil(Math.random() * 6);
      setLastDice(dice);
      setTurns(t => t + 1);
      setRollsRemaining(r => r - 1);

      setPositions(prev => {
        const oldPos = prev[0];
        let newPos = Math.min(oldPos + dice, 100);

        const scene = sceneRef.current;
        if (!scene) {
          setRolling(false);
          return prev;
        }

        scene.moveToken(0, oldPos, newPos, () => {
          let msg = `You rolled ${dice}`;
          let finalPos = newPos;

          const checkMysteryReward = (pos) => {
            if (pos === 38 || pos === 84) {
              const randomReward = ALL_REWARDS[Math.floor(Math.random() * ALL_REWARDS.length)];
              setReward(randomReward);
              return true;
            }
            return false;
          };

          // Check snake
          if (SNAKES[newPos]) {
            finalPos = SNAKES[newPos];
            scene.moveToken(0, newPos, finalPos, () => {
              checkMysteryReward(finalPos);
              completeMove(finalPos);
            });
            return;
          }

          // Check ladder
          if (LADDERS[newPos]) {
            finalPos = LADDERS[newPos].top;
            scene.moveToken(0, newPos, finalPos, () => {
              checkMysteryReward(finalPos);
              completeMove(finalPos);
            });
            return;
          }

          checkMysteryReward(finalPos);
          completeMove(finalPos);
        });

        return prev;
      });
    };

    // Animation
    let count = 0;
    const interval = setInterval(() => {
      setLastDice(Math.ceil(Math.random() * 6));
      count++;
      if (count >= 10) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 60);
  };

  function completeMove(finalPos) {
    setPositions([finalPos]);
    setRolling(false);

    if (finalPos === 100) {
      setWinner(0);
    } else if (rollsRemaining === 1 && finalPos !== 38 && finalPos !== 84) {
      // check rollsRemaining === 1 because it's captured in closure or we rely on state update
      // actually better to check it here after state update or pass it
    }
  }

  useEffect(() => {
    if (started && rollsRemaining === 0 && !reward && !winner && !rolling && !isRollingDice) {
      setGameOver(true);
    }
  }, [rollsRemaining, reward, winner, rolling, isRollingDice, started]);

  // removed log function
  function saveToleaderboard(name) {
    const entry = { name, turns, date: new Date().toLocaleDateString() };
    const lb = [...leaderboard, entry]
      .sort((a, b) => a.turns - b.turns)
      .slice(0, 10);
    setLeaderboard(lb);
    localStorage.setItem('cn_leaderboard', JSON.stringify(lb));
  }

  function resetGame() {
    setPositions([1]);
    setTurn(0);
    setLastDice(null);
    setRolling(false);
    setWinner(null);
    setReward(null);
    setTurns(0);
    setStarted(false);
    setGameOver(false);
    const scene = sceneRef.current;
    if (scene?.tokens) {
      scene.tokens.forEach((t) => {
        const { x, y } = cellToXY(1);
        t.setPosition(x, y);
      });
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  /* ── Render ─── */
  return (
    <div className="sl-wrapper">
      {/* Name entry screen */}
      {!started && (
        <div className="sl-start-screen">
          <h1 className="sl-start-title">Snake &amp; Ladders</h1>
          <p className="sl-start-sub">Climb to the mystery rewards within limited rolls!</p>
          <div className="sl-name-row">
            <span className="sl-name-label" style={{ color: PLAYER_COLORS[0] }}>●</span>
            <input
              className="sl-name-input"
              value={nameInput[0]}
              onChange={e => setNameInput([e.target.value])}
              maxLength={16}
              placeholder="Your name"
            />
          </div>
          <button
            className="sl-btn-primary"
            onClick={() => {
              setPlayerNames([nameInput[0] || 'Player 1']);
              setRollsRemaining(Math.floor(Math.random() * 7) + 6);
              setStarted(true);
            }}
          >
            🎮 Start Challenge
          </button>
        </div>
      )}

      {started && (
        <div className="sl-game-layout">
          {/* Board */}
          <div className="sl-board-area">
            <div ref={mountRef} className="sl-canvas-mount" />
          </div>

          {/* Side Panel */}
          <div className="sl-panel">
            <div className="sl-brand">CACAO<em>NOIR</em></div>
            <h2 className="sl-panel-title">Snake &amp; Ladders</h2>

            {/* Dice and Rolls */}
            <div className="sl-dice-area">
              <div className="sl-dice">
                {lastDice ? ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][lastDice - 1] : '🎲'}
              </div>
              <div className="sl-rolls-badge">
                {rollsRemaining} Rolls Left
              </div>
              <button
                className="sl-roll-btn"
                onClick={rollDice}
                disabled={rolling || !!winner || isRollingDice || rollsRemaining <= 0 || reward}
              >
                {isRollingDice ? 'Rolling…' : (rolling ? 'Moving…' : 'Roll Dice')}
              </button>
            </div>

            {/* Player position */}
            <div className="sl-positions">
              <div className="sl-pos-row sl-pos-active">
                <span className="sl-pos-dot" style={{ background: PLAYER_COLORS[0] }} />
                <span className="sl-pos-name">{playerNames[0]}</span>
                <span className="sl-pos-cell">Cell {positions[0]}</span>
              </div>
            </div>

            {/* Catchy Quotes */}
            <div className="sl-quote-box">
              <p className="sl-quote">"Climb the <em>peak</em>, unlock the <em>mystery</em>."</p>
              <p className="sl-quote-sub">Hidden rewards await the daring.</p>
            </div>

            {/* End Game */}
            <button className="sl-reset-btn" onClick={() => navigate('/')}>🚪 End Game</button>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {reward && (
        <div className="sl-modal-overlay">
          <div className="sl-modal" onClick={e => e.stopPropagation()}>
            <div className="sl-modal-emoji">🎁</div>
            <h2 className="sl-modal-title">Success! You found a reward!</h2>
            <p className="sl-modal-label">{reward.label}</p>
            <div className="sl-modal-code">{reward.code}</div>
            <div className="sl-modal-actions">
              <button className="sl-btn-primary" onClick={() => {
                copyCode(reward.code);
                setTimeout(() => navigate('/'), 1500);
              }}>
                {copied === reward.code ? '✓ Copied! Redirecting...' : '📋 Copy Code & Exit'}
              </button>
              <button className="sl-btn-ghost" onClick={() => navigate('/')}>End Game Without Code</button>
            </div>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {winner !== null && (
        <div className="sl-modal-overlay">
          <div className="sl-modal sl-modal-win">
            <div className="sl-modal-emoji">🏆</div>
            <h2 className="sl-modal-title">{playerNames[0]} Won!</h2>
            <p className="sl-modal-label">Grand Victory in only {turns} rolls!</p>

            <div className="sl-win-reward">
              <p className="sl-modal-sub-label">Your Grand Victory Reward:</p>
              <div className="sl-modal-code">GOLDEN30</div>
              <p className="sl-modal-hint">(30% Off Golden Ticket)</p>
            </div>

            <div className="sl-win-share">
              <div className="sl-modal-actions">
                <button className="sl-btn-primary" onClick={() => alert('Screenshot captured! Saved to your downloads. (Simulation)')}>
                  📸 Share Screenshot
                </button>
                <button className="sl-btn-ghost" onClick={() => {
                  copyCode('GOLDEN30');
                }}>
                  {copied === 'GOLDEN30' ? '✓ Copied!' : '📋 Copy My Ticket'}
                </button>
                <button className="sl-btn-ghost" style={{ width: '100%' }} onClick={() => navigate('/')}>
                  🚪 End Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <div className="sl-modal-emoji">⌛</div>
            <h2 className="sl-modal-title">Out of Rolls!</h2>
            <p className="sl-modal-label">The rewards are almost within reach! Collect your new pass.</p>
            <div className="sl-modal-actions">
              <button className="sl-btn-ghost" onClick={() => navigate('/')}>🚪 Exit to Shop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
