# 🤖 Playwright MCP Setup - Copilot Integration

## ✅ MCP Server Status

- **Running**: http://localhost:3000
- **MCP Endpoint**: http://localhost:3000/mcp
- **SSE Endpoint**: http://localhost:3000/sse

## 🚀 Quick Start

### 1. Start MCP Server

```bash
# Opción 1: Usar script npm
npm run mcp:start

# Opción 2: Comando directo
npx @playwright/mcp@latest --port 3000 --host 0.0.0.0
```

### 2. Configure VS Code/Copilot

El archivo de configuración ya está creado en `.vscode/mcp-config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## 🎯 Beneficios del MCP

### Para Copilot:

- ✅ **Sugerencias específicas** de Playwright APIs
- ✅ **Autocompletado mejorado** para selectores y actions
- ✅ **Context awareness** del DOM actual durante tests
- ✅ **Generación automática** de page objects
- ✅ **Best practices** integradas en sugerencias

### Para Development:

- 🔍 **Live DOM inspection** durante test writing
- 📸 **Screenshot integration** para debugging
- 🎬 **Video recording** automático
- 📊 **Test execution insights**

## 💡 Cómo Usar

### 1. Escribir Tests con Copilot

Ahora cuando escribas tests, Copilot tendrá acceso a:

- Estado actual del DOM de tu aplicación
- Selectores disponibles en tiempo real
- Mejores prácticas de Playwright

### 2. Ejemplo de Uso

```typescript
// Copilot ahora puede sugerir selectores reales de tu app
test('should load dashboard players', async ({ page }) => {
  await page.goto('/dashboard');

  // Copilot sugiere selectores basados en el DOM real
  await expect(page.getByTestId('players-list')).toBeVisible();

  // Auto-completion para elementos específicos de tu app
  const playerCards = page.locator('[data-testid="player-card"]');

  // Verificaciones contextuales
  await expect(playerCards).toHaveCount(5);
});
```

### 3. Page Object Generation

Copilot puede generar page objects automáticamente basados en tu DOM:

```typescript
// Copilot puede generar esto automáticamente
export class DashboardPage {
  constructor(private page: Page) {}

  // Selectores generados basados en DOM real
  get playersSection() {
    return this.page.getByTestId('dashboard-players-section');
  }

  get kpiCards() {
    return this.page.locator('[data-testid="kpi-card"]');
  }

  // Actions contextual generation
  async waitForPlayersLoad() {
    await this.playersSection.waitFor();
    await expect(this.kpiCards.first()).toBeVisible();
  }
}
```

## 🔧 Advanced Configuration

### Custom Browser Settings

```bash
# Para usar Chrome específico
npm run mcp:start -- --browser chrome

# Para modo headless
npm run mcp:start -- --headless

# Para device emulation
npm run mcp:start -- --device "iPhone 15"
```

### With Proxy/Auth

```bash
# Con proxy
npm run mcp:start -- --proxy-server "http://proxy:8080"

# Con storage state para auth
npm run mcp:start -- --storage-state auth-state.json
```

## 🐛 Troubleshooting

### MCP Server Not Connecting

```bash
# Verificar que el servidor esté ejecutándose
curl http://localhost:3000/mcp

# Reiniciar servidor
pkill -f playwright
npm run mcp:start
```

### VS Code No Recognizing MCP

1. Restart VS Code
2. Check Copilot extension is updated
3. Verify `.vscode/mcp-config.json` is correct
4. Check MCP server logs

### Performance Issues

```bash
# Usar modo headless para mejor performance
npm run mcp:start -- --headless

# Limitar capabilities
npm run mcp:start -- --caps ""
```

## 📊 Monitoring

### Server Status

- **Health Check**: http://localhost:3000/health
- **Logs**: Check terminal donde ejecutaste `npm run mcp:start`

### Usage Metrics

El MCP server loggea automáticamente:

- API calls from Copilot
- DOM queries executed
- Test suggestions generated

## 🎓 Best Practices

### 1. Keep Server Running

- Start MCP server before coding
- Use background process: `npm run mcp:start &`

### 2. Leverage Real DOM

- Write tests while app is running
- MCP provides live DOM data to Copilot

### 3. Structured Testing

```typescript
// Copilot now understands your app structure better
describe('Dashboard Players Integration', () => {
  test('should fetch and display players from Supabase', async ({ page }) => {
    // MCP-enhanced suggestions here
  });
});
```

---

## 🚀 Ready to Use!

**Current Status**: ✅ MCP Server Running on http://localhost:3000

**Next Steps**:

1. Keep the server running (`npm run mcp:start`)
2. Start writing tests - Copilot is now enhanced!
3. Try asking Copilot to generate tests for specific components

**Pro Tip**: Copilot can now inspect your actual dashboard DOM and suggest real selectors instead of generic ones!
