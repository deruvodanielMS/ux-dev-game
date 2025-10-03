import type { Page } from '@playwright/test';

/**
 * Page Object Model for the Dashboard using data-testid for stable selectors
 */
export class DashboardPage {
  constructor(private page: Page) {}

  // Main dashboard container
  get dashboardPage() {
    return this.page.getByTestId('dashboard-page');
  }

  get dashboardHeader() {
    return this.page.getByTestId('dashboard-header');
  }

  get dashboardTitle() {
    return this.page.getByTestId('dashboard-title');
  }

  get dashboardSubtitle() {
    return this.page.getByTestId('dashboard-subtitle');
  }

  // Navigation elements
  get navigationSection() {
    return this.page.getByTestId('dashboard-navigation');
  }

  get battleButton() {
    return this.page.getByTestId('nav-battle-button');
  }

  get progressButton() {
    return this.page.getByTestId('nav-progress-button');
  }

  get ladderButton() {
    return this.page.getByTestId('nav-ladder-button');
  }

  // KPI elements
  get kpisSection() {
    return this.page.getByTestId('dashboard-kpis');
  }

  get levelKPI() {
    return this.page.getByTestId('kpi-level');
  }

  get levelKPIValue() {
    return this.page.getByTestId('kpi-level-value');
  }

  get experienceKPI() {
    return this.page.getByTestId('kpi-experience');
  }

  get experienceKPIValue() {
    return this.page.getByTestId('kpi-experience-value');
  }

  get enemiesDefeatedKPI() {
    return this.page.getByTestId('kpi-enemies-defeated');
  }

  get enemiesDefeatedKPIValue() {
    return this.page.getByTestId('kpi-enemies-defeated-value');
  }

  get totalPlayersKPI() {
    return this.page.getByTestId('kpi-total-players');
  }

  get totalPlayersKPIValue() {
    return this.page.getByTestId('kpi-total-players-value');
  }

  // Content sections
  get dashboardContent() {
    return this.page.getByTestId('dashboard-content');
  }

  get charactersSection() {
    return this.page.getByTestId('characters-section');
  }

  get topPlayersSection() {
    return this.page.getByTestId('top-players-section');
  }

  // Player list
  get playersList() {
    return this.page.getByTestId('character-list');
  }

  get playersListItems() {
    return this.page.getByTestId(/^character-item-\d+$/);
  }

  get playersLoadingState() {
    return this.page.getByTestId('character-list-loading');
  }

  get playersErrorState() {
    return this.page.getByTestId('character-list-error');
  }

  get playersEmptyState() {
    return this.page.getByTestId('character-list-empty');
  }

  // Character cards
  get characterCards() {
    return this.page.getByTestId('character-card-wrapper');
  }

  // Actions
  async navigate() {
    await this.page.goto('/dashboard');
  }

  async selectFirstCharacter() {
    const firstCard = this.characterCards.first();
    await firstCard.click();
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    // Wait for the dashboard title to be visible
    await this.dashboardTitle.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForPlayersToLoad() {
    // Wait for loading state to finish and show list, empty, or error state
    await this.page.waitForFunction(
      () => {
        const loading = document.querySelector(
          '[data-testid="character-list-loading"]',
        );
        const list = document.querySelector('[data-testid="character-list"]');
        const empty = document.querySelector(
          '[data-testid="character-list-empty"]',
        );
        const error = document.querySelector(
          '[data-testid="character-list-error"]',
        );

        return !loading && (list || empty || error);
      },
      { timeout: 15000 },
    );
  }

  async clickBattle() {
    await this.battleButton.click();
  }

  async clickProgress() {
    await this.progressButton.click();
  }

  async clickLadder() {
    await this.ladderButton.click();
  }

  // Assertions helpers
  async getCharacterCount() {
    return await this.characterCards.count();
  }

  async isLoaded() {
    return await this.dashboardTitle.isVisible();
  }

  async getTotalPlayersText() {
    return await this.totalPlayersKPIValue.textContent();
  }

  async getKPIValues() {
    const level = await this.levelKPIValue.textContent();
    const experience = await this.experienceKPIValue.textContent();
    const enemies = await this.enemiesDefeatedKPIValue.textContent();
    const totalPlayers = await this.totalPlayersKPIValue.textContent();

    return {
      level: level?.trim() || '',
      experience: experience?.trim() || '',
      enemies: enemies?.trim() || '',
      totalPlayers: totalPlayers?.trim() || '',
    };
  }

  async hasPlayersLoaded() {
    // Check if players have loaded successfully
    return await this.playersList.isVisible();
  }

  async hasPlayersLoadingState() {
    return await this.playersLoadingState.isVisible();
  }

  async hasPlayersEmptyState() {
    return await this.playersEmptyState.isVisible();
  }

  async hasPlayersErrorState() {
    return await this.playersErrorState.isVisible();
  }
}
