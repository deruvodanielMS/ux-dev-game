import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Traducciones
const resources = {
  es: {
    translation: {
      // Navigation
      'nav.battle': 'Ir a Batalla',
      'nav.progress': 'Mapa de Progreso',
      'nav.ladder': 'Ladder',
      'nav.profile': 'Perfil',

      // Common actions
      'action.start': 'Empezar',
      'action.continue': 'Continuar',
      'action.cancel': 'Cancelar',
      'action.confirm': 'Confirmar',
      'action.close': 'Cerrar',
      'action.save': 'Guardar',
      'action.edit': 'Editar',
      'action.delete': 'Eliminar',
      'action.back': 'Volver',
      'action.next': 'Siguiente',
      'action.previous': 'Anterior',

      // User menu
      'user.profile': 'Editar perfil',
      'user.settings': 'Configuración',
      'user.logout': 'Cerrar sesión',
      'user.level': 'Nivel {{level}}',
      'user.noName': 'Sin nombre',

      // Battle
      'battle.title': 'Batalla',
      'battle.victory': '¡Victoria!',
      'battle.defeat': 'Derrota',
      'battle.playerTurn': 'Tu turno',
      'battle.enemyTurn': 'Turno enemigo',

      // Character
      'character.level': 'Nv {{level}}',
      'character.select': 'Elige tu personaje',
      'character.absorbed': 'Los absorbidos no están disponibles',
      'character.stats': 'Estadísticas',
      'character.noStats': 'Sin estadísticas disponibles',

      // Progress Map
      'progress.title': 'Mapa de Progreso',
      'progress.currentLevel': 'Nivel Actual',
      'progress.completed': 'Completado',
      'progress.locked': 'Bloqueado',
      'progress.level1': 'Nivel 1: Fundamentos',
      'progress.level2': 'Nivel 2: Desafíos Intermedios',
      'progress.level3': 'Nivel 3: Amenazas Críticas',

      // Profile
      'profile.setup': 'Configurar Perfil',
      'profile.name': 'Nombre',
      'profile.email': 'Email',
      'profile.avatar': 'Avatar',
      'profile.uploadAvatar': 'Sube tu avatar',
      'profile.chooseImage': 'Elegir imagen',
      'profile.noAvatar': 'Sin avatar',

      // Theme
      'theme.light': 'Tema Claro',
      'theme.dark': 'Tema Oscuro',
      'theme.switch': 'Cambiar tema',

      // Audio
      'audio.toggle': 'Alternar música',
      'audio.volume': 'Volumen',

      // Ladder
      'ladder.title': 'Clasificación',
      'ladder.position': 'Posición',
      'ladder.player': 'Jugador',
      'ladder.level': 'Nivel',
      'ladder.experience': 'Experiencia',
      'ladder.loading': 'Cargando clasificación...',
      'ladder.refresh': 'Actualizar',

      // Cards & Battle actions
      'card.codeReview.title': 'Code Review',
      'card.codeReview.desc': 'Recupera HP revisando PRs',
      'card.bugFix.title': 'Bug Fix',
      'card.bugFix.desc': 'Arregla un bug: daño directo',
      'card.refactor.title': 'Refactor',
      'card.refactor.desc': 'Mejora el código y causa daño estable',

      // Character status
      'character.absorption.risk': 'En riesgo',
      'character.absorption.safe': 'Tiempo para absorción',
      'character.absorption.riskText': 'En riesgo: sin PR en 30 días',
      'character.absorption.daysLeft': '{{days}} días restantes',
      'character.absorbed.title': 'Absorbidos por la IA',
      'character.absorbed.subtitle':
        'Estos personajes ya no están disponibles. La IA los absorbió.',

      // Settings & Configuration
      'settings.title': 'Configuración',
      'settings.audio.description':
        'Controla la reproducción de música de fondo',
      'settings.theme.description': 'Cambia entre tema claro y oscuro',
      'settings.language.description': 'Selecciona tu idioma preferido',

      // Errors
      'error.general': 'Ha ocurrido un error',
      'error.notFound': 'Página no encontrada',
      'error.unauthorized': 'No autorizado',
      'error.network': 'Error de conexión',
      'error.404.title': '404 – Página No Encontrada',
      'error.404.message':
        'La página que buscas no existe o fue movida. Tal vez seguiste un enlace desactualizado—o encontraste un bug en nuestro mapa del multiverso.',
      'error.404.action': 'Volver al Inicio',

      // Battle Page
      'battle.reset': 'Reiniciar',
      'battle.continue': 'Continuar Batalla',
      'battle.defeatedAll':
        '¡Has derrotado a todos los enemigos disponibles! Más pronto...',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Resumen de tu progreso y acciones rápidas',
      'dashboard.level': 'Nivel',
      'dashboard.experience': 'Experiencia',
      'dashboard.enemiesDefeated': 'Enemigos derrotados',
      'dashboard.totalPlayers': 'Jugadores totales',
      'dashboard.characters': 'Personajes',
      'dashboard.startBattle': 'Empezar Batalla',
      'dashboard.goToDashboard': 'Ir al Dashboard',

      // Ladderboard
      'ladderboard.weeklyRanking': 'Ranking Semanal',
      'ladderboard.rank': '#',
      'ladderboard.battlesWon': 'Batallas Ganadas',
      'ladderboard.damageDealt': 'Daño Infligido',
      'ladderboard.damageTaken': 'Daño Recibido',
      'ladderboard.battlesWonShort': 'BW',
      'ladderboard.damageDealtShort': 'DH',
      'ladderboard.damageTakenShort': 'DR',
      'ladderboard.couldNotLoad': 'No se pudo cargar el ranking',

      // Stats labels
      'stats.battlesWon': 'Batallas Ganadas',
      'stats.battlesLost': 'Batallas Perdidas',
      'stats.damageDealt': 'Daño Infligido',
      'stats.damageTaken': 'Daño Recibido',
      'stats.enemiesDefeated': 'Enemigos Derrotados',
      'stats.lastUpdated': 'Actualizado',
      'stats.aiLevel': 'Nivel IA',

      // Footer
      'footer.gameRules': 'Reglas del juego',
      'footer.welcomeRules': 'Bienvenido a Duelo de Código. Reglas básicas:',
      'footer.rule1': 'Cada jugador tiene Salud y Stamina.',
      'footer.rule2':
        'Jugar cartas consume Stamina y produce efectos (daño o curación).',

      // Welcome
      'welcome.title': 'Duelo de Código',
      'welcome.subtitle':
        'La IA está absorbiendo a quienes no se mantienen actualizados y no colaboran. Tu misión: unirte al equipo y luchar por el código.',
      'welcome.login': 'Iniciar Sesión',
      'welcome.getStarted': 'Empezar la batalla',
    },
  },
  en: {
    translation: {
      // Navigation
      'nav.battle': 'Go to Battle',
      'nav.progress': 'Progress Map',
      'nav.ladder': 'Ladder',
      'nav.profile': 'Profile',

      // Common actions
      'action.start': 'Start',
      'action.continue': 'Continue',
      'action.cancel': 'Cancel',
      'action.confirm': 'Confirm',
      'action.close': 'Close',
      'action.save': 'Save',
      'action.edit': 'Edit',
      'action.delete': 'Delete',
      'action.back': 'Back',
      'action.next': 'Next',
      'action.previous': 'Previous',

      // User menu
      'user.profile': 'Edit profile',
      'user.settings': 'Settings',
      'user.logout': 'Sign out',
      'user.level': 'Level {{level}}',
      'user.noName': 'No name',

      // Battle
      'battle.title': 'Battle',
      'battle.victory': 'Victory!',
      'battle.defeat': 'Defeat',
      'battle.playerTurn': 'Your turn',
      'battle.enemyTurn': 'Enemy turn',

      // Character
      'character.level': 'Lv {{level}}',
      'character.select': 'Choose your character',
      'character.absorbed': 'Absorbed characters are not available',
      'character.stats': 'Statistics',
      'character.noStats': 'No statistics available',

      // Progress Map
      'progress.title': 'Progress Map',
      'progress.currentLevel': 'Current Level',
      'progress.completed': 'Completed',
      'progress.locked': 'Locked',
      'progress.level1': 'Level 1: Fundamentals',
      'progress.level2': 'Level 2: Intermediate Challenges',
      'progress.level3': 'Level 3: Critical Threats',

      // Profile
      'profile.setup': 'Profile Setup',
      'profile.name': 'Name',
      'profile.email': 'Email',
      'profile.avatar': 'Avatar',
      'profile.uploadAvatar': 'Upload your avatar',
      'profile.chooseImage': 'Choose image',
      'profile.noAvatar': 'No avatar',

      // Theme
      'theme.light': 'Light Theme',
      'theme.dark': 'Dark Theme',
      'theme.switch': 'Switch theme',

      // Audio
      'audio.toggle': 'Toggle music',
      'audio.volume': 'Volume',

      // Ladder
      'ladder.title': 'Leaderboard',
      'ladder.position': 'Position',
      'ladder.player': 'Player',
      'ladder.level': 'Level',
      'ladder.experience': 'Experience',
      'ladder.loading': 'Loading leaderboard...',
      'ladder.refresh': 'Refresh',

      // Cards & Battle actions
      'card.codeReview.title': 'Code Review',
      'card.codeReview.desc': 'Recover HP by reviewing PRs',
      'card.bugFix.title': 'Bug Fix',
      'card.bugFix.desc': 'Fix a bug: direct damage',
      'card.refactor.title': 'Refactor',
      'card.refactor.desc': 'Improve code and cause stable damage',

      // Character status
      'character.absorption.risk': 'At risk',
      'character.absorption.safe': 'Time until absorption',
      'character.absorption.riskText': 'At risk: no PR in 30 days',
      'character.absorption.daysLeft': '{{days}} days remaining',
      'character.absorbed.title': 'Absorbed by AI',
      'character.absorbed.subtitle':
        'These characters are no longer available. AI has absorbed them.',

      // Settings & Configuration
      'settings.title': 'Settings',
      'settings.audio.description': 'Control background music playback',
      'settings.theme.description': 'Switch between light and dark theme',
      'settings.language.description': 'Select your preferred language',

      // Errors
      'error.general': 'An error occurred',
      'error.notFound': 'Page not found',
      'error.unauthorized': 'Unauthorized',
      'error.network': 'Connection error',
      'error.404.title': '404 – Page Not Found',
      'error.404.message':
        "The page you are looking for doesn't exist or was moved. Perhaps you followed an outdated link—or encountered a bug in our map of the multiverse.",
      'error.404.action': 'Back to Home',

      // Battle Page
      'battle.reset': 'Reset',
      'battle.continue': 'Continue Battle',
      'battle.defeatedAll':
        'You have defeated all available enemies! More coming soon...',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Summary of your progress and quick actions',
      'dashboard.level': 'Level',
      'dashboard.experience': 'Experience',
      'dashboard.enemiesDefeated': 'Enemies defeated',
      'dashboard.totalPlayers': 'Total players',
      'dashboard.characters': 'Characters',
      'dashboard.startBattle': 'Start Battle',
      'dashboard.goToDashboard': 'Go to Dashboard',

      // Ladderboard
      'ladderboard.weeklyRanking': 'Weekly Ranking',
      'ladderboard.rank': '#',
      'ladderboard.battlesWon': 'Battles Won',
      'ladderboard.damageDealt': 'Damage Dealt',
      'ladderboard.damageTaken': 'Damage Taken',
      'ladderboard.battlesWonShort': 'BW',
      'ladderboard.damageDealtShort': 'DH',
      'ladderboard.damageTakenShort': 'DR',
      'ladderboard.couldNotLoad': 'Could not load ranking',

      // Stats labels
      'stats.battlesWon': 'Battles Won',
      'stats.battlesLost': 'Battles Lost',
      'stats.damageDealt': 'Damage Dealt',
      'stats.damageTaken': 'Damage Taken',
      'stats.enemiesDefeated': 'Enemies Defeated',
      'stats.lastUpdated': 'Updated',
      'stats.aiLevel': 'AI Level',

      // Footer
      'footer.gameRules': 'Game Rules',
      'footer.welcomeRules': 'Welcome to Code Duel. Basic rules:',
      'footer.rule1': 'Each player has Health and Stamina.',
      'footer.rule2':
        'Playing cards consumes Stamina and produces effects (damage or healing).',

      // Welcome
      'welcome.title': 'Code Duel',
      'welcome.subtitle':
        "AI is absorbing those who don't stay updated and don't collaborate. Your mission: join the team and fight for the code.",
      'welcome.login': 'Sign In',
      'welcome.getStarted': 'Start the battle',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
