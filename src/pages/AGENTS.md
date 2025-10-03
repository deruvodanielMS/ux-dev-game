# AGENTS.md - Pages

**Page Architecture Guide for LLMs working on "Duelo de Código"**

## 🏛️ Pages Overview

```
src/pages/
├── BattlePage/                 # Combat and battle logic
│   ├── BattlePage.tsx
│   └── BattlePage.module.css
├── DashboardPage/              # Main dashboard view
│   ├── DashboardPage.tsx
│   └── DashboardPage.module.css
├── NotFoundPage/               # 404 error page
│   ├── NotFoundPage.tsx
│   └── NotFoundPage.module.css
├── ProgressMapPage/            # Level progression map
│   ├── ProgressMapPage.tsx
│   └── ProgressMapPage.module.css
├── ProfileSetupPage/           # Initial profile setup
│   ├── ProfileSetupPage.tsx
│   └── ProfileSetupPage.module.css
└── WelcomePage/                # Landing/authentication page
    ├── WelcomePage.tsx
    └── WelcomePage.module.css
```

## 🎯 Page Architecture Principles

### 1. **Single Responsibility**

- Each page handles one main user flow
- Pages orchestrate components and context
- Business logic in services and context, not pages

### 2. **Route-Component Mapping**

- Page components map directly to routes
- Use React Router for navigation
- Handle route parameters and query strings

### 3. **Context Integration**

- Pages consume multiple contexts
- Coordinate between different contexts
- Handle authentication and authorization

## 📋 Page Patterns

### Base Page Structure

```tsx
// pages/ExamplePage/ExamplePage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ExamplePageProps } from '@/types';
import { useGameContext } from '@/context/GameContext';
import { usePlayerContext } from '@/context/PlayerContext';
import { Header } from '@/components/organisms/Header';
import { AppFooter } from '@/components/organisms/AppFooter';

import styles from './ExamplePage.module.css';

export const ExamplePage = ({ className, ...rest }: ExamplePageProps) => {
  const navigate = useNavigate();
  const { state: gameState } = useGameContext();
  const { player, isAuthenticated } = usePlayerContext();

  useEffect(() => {
    // Page initialization logic
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`${styles.examplePage} ${className || ''}`} {...rest}>
      <Header />
      <main className={styles.main}>{/* Page content */}</main>
      <AppFooter />
    </div>
  );
};
```

## 🔧 Individual Pages

### `WelcomePage.tsx` - Landing & Auth

**Purpose**: Entry point, authentication, first-time experience

```tsx
import { useAuth0 } from '@auth0/auth0-react';
import { usePlayerContext } from '@/context/PlayerContext';
import { AuthButton } from '@/components/organisms/AuthButton';

export const WelcomePage = () => {
  const { isAuthenticated } = useAuth0();
  const { player } = usePlayerContext();

  // Handle different authentication states
  // Show game introduction
  // Direct to appropriate next step
};
```

**Key Features:**

- Auth0 login integration
- Game introduction/tutorial
- New user onboarding
- Route to dashboard or profile setup

### `ProfileSetupPage.tsx` - Initial Setup

**Purpose**: First-time user profile creation

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AvatarUploader } from '@/components/molecules/AvatarUploader';
import { usePlayerContext } from '@/context/PlayerContext';

export const ProfileSetupPage = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const { createPlayer } = usePlayerContext();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Create player profile
    // Upload avatar
    // Navigate to main game
  };
};
```

**Key Features:**

- Player name input
- Avatar upload
- Profile creation
- Navigation to game areas

### `DashboardPage.tsx` - Main Hub

**Purpose**: Central game hub, player stats, navigation

```tsx
import { usePlayerContext } from '@/context/PlayerContext';
import { Ladderboard } from '@/components/organisms/Ladderboard';
import { CharacterList } from '@/components/organisms/CharacterList';

export const DashboardPage = () => {
  const { player, players } = usePlayerContext();

  return (
    <div className={styles.dashboard}>
      <section className={styles.playerSection}>
        {/* Player stats and info */}
      </section>

      <section className={styles.leaderboard}>
        <Ladderboard players={players} />
      </section>

      <section className={styles.characters}>
        <CharacterList />
      </section>
    </div>
  );
};
```

**Key Features:**

- Player statistics display
- Leaderboard/ladder
- Character selection
- Navigation to other areas

### `ProgressMapPage.tsx` - Level Selection

**Purpose**: Level progression, enemy selection, progress tracking

```tsx
import { useGameContext } from '@/context/GameContext';
import { ProgressMapTemplate } from '@/components/templates/ProgressMapTemplate';

export const ProgressMapPage = () => {
  const { state: gameState, dispatch } = useGameContext();

  const handleLevelSelect = (levelId: string) => {
    dispatch({ type: 'SELECT_LEVEL', payload: levelId });
    // Navigate to battle or show level details
  };

  return (
    <ProgressMapTemplate
      currentLevel={gameState.currentLevel}
      unlockedLevels={gameState.unlockedLevels}
      onLevelSelect={handleLevelSelect}
    />
  );
};
```

**Key Features:**

- Visual level progression map
- Level status (locked/unlocked/completed)
- Level selection and navigation
- Progress visualization

### `BattlePage.tsx` - Combat System

**Purpose**: Turn-based combat, battle mechanics

```tsx
import { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { battleReducer, initialBattleState } from '@/reducers/battleReducer';
import { AttackButton } from '@/components/atoms/AttackButton';
import { CharacterCard } from '@/components/molecules/CharacterCard';

export const BattlePage = () => {
  const { enemyId } = useParams();
  const navigate = useNavigate();
  const [battleState, dispatch] = useReducer(battleReducer, initialBattleState);

  const handleAttack = () => {
    dispatch({ type: 'PLAYER_ATTACK' });
  };

  const handleBattleEnd = (winner: 'player' | 'enemy') => {
    // Process battle results
    // Update player progress
    // Navigate based on outcome
  };

  return (
    <div className={styles.battle}>
      <div className={styles.combatants}>
        <CharacterCard character={battleState.player} />
        <CharacterCard character={battleState.enemy} />
      </div>

      <div className={styles.actions}>
        <AttackButton
          onClick={handleAttack}
          disabled={battleState.turn !== 'player'}
        />
      </div>
    </div>
  );
};
```

**Key Features:**

- Turn-based combat system
- Character health/status display
- Attack animations and feedback
- Battle result processing

### `NotFoundPage.tsx` - Error Handling

**Purpose**: 404 error page, navigation recovery

```tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );
};
```

**Key Features:**

- User-friendly error message
- Navigation back to main areas
- Consistent styling with game theme

## 🚀 Page Development Patterns

### Authentication Handling

```tsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProtectedPage = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    // Protected page content
  );
};
```

### Data Loading

```tsx
import { useEffect, useState } from 'react';
import { useToast } from '@/context/ToastContext';

export const DataPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchPageData();
        setData(result);
      } catch (error) {
        showToast('Failed to load data', 'error');
        console.error('Data loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <ErrorMessage />;

  return (
    // Page with data
  );
};
```

### Navigation Patterns

```tsx
import { useNavigate, useLocation } from 'react-router-dom';

export const NavigationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string, state?: any) => {
    navigate(path, { state, replace: false });
  };

  const goBack = () => {
    navigate(-1); // Browser back
  };

  const redirectWithState = () => {
    navigate('/dashboard', {
      state: { from: location.pathname },
    });
  };
};
```

## 🎮 Game Flow Integration

### Level Progression Flow

```
WelcomePage → ProfileSetupPage → DashboardPage → ProgressMapPage → BattlePage → DashboardPage
```

### Authentication Flow

```
WelcomePage (login) → ProfileSetupPage (if new) → DashboardPage
```

### Battle Flow

```
ProgressMapPage (select enemy) → BattlePage (combat) → DashboardPage (results)
```

## 🔧 Page Best Practices

### 1. **Layout Consistency**

```tsx
// Use consistent layout structure
export const StandardPage = () => (
  <div className={styles.pageContainer}>
    <Header />
    <main className={styles.main}>{/* Page content */}</main>
    <AppFooter />
  </div>
);
```

### 2. **Error Boundaries**

```tsx
import { ErrorBoundary } from 'react-error-boundary';

export const SafePage = () => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <PageContent />
  </ErrorBoundary>
);
```

### 3. **SEO & Meta Tags**

```tsx
import { useEffect } from 'react';

export const SEOPage = () => {
  useEffect(() => {
    document.title = 'Page Title - Duelo de Código';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Page description'
    );
  }, []);

  return (
    // Page content
  );
};
```

### 4. **Performance Optimization**

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyComponent = lazy(() => import('@/components/HeavyComponent'));

export const OptimizedPage = () => (
  <div>
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  </div>
);
```

## ⚠️ Common Mistakes to Avoid

1. **Direct API calls in pages**

   ```tsx
   // ❌ Bad
   useEffect(() => {
     supabase.from('players').select('*');
   }, []);

   // ✅ Good
   useEffect(() => {
     fetchPlayers();
   }, []);
   ```

2. **Missing error handling**

   ```tsx
   // ❌ Bad
   const data = await fetchData();

   // ✅ Good
   try {
     const data = await fetchData();
   } catch (error) {
     showToast('Error loading data', 'error');
   }
   ```

3. **Not handling loading states**

   ```tsx
   // ❌ Bad
   return <div>{data.map(...)}</div>;

   // ✅ Good
   if (loading) return <Loading />;
   if (error) return <Error />;
   return <div>{data.map(...)}</div>;
   ```

## 🧪 Testing Pages

### Page Testing Pattern

```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ExamplePage } from './ExamplePage';

const renderPage = (props = {}) =>
  render(
    <BrowserRouter>
      <ExamplePage {...props} />
    </BrowserRouter>,
  );

test('renders page content', () => {
  renderPage();
  expect(screen.getByRole('main')).toBeInTheDocument();
});
```

---

**Remember**: Pages orchestrate the user experience. Keep them focused on navigation, layout, and coordinating between components and services.
