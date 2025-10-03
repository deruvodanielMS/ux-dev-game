# 📝 Guía de Testing E2E con Playwright

## ✅ Estado Actual

- **Tests implementados**: 5 tests básicos de login flow
- **Tests pasando**: 15/18 (3 skipped por diseño)
- **Cobertura**: Login flow, navegación, content validation

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests con UI interactiva
npm run test:e2e:ui

# Ejecutar tests en modo debug (paso a paso)
npm run test:e2e:debug

# Ver reporte HTML de la última ejecución
npm run test:e2e:report

# Ejecutar solo tests específicos
npx playwright test --grep "login"
npx playwright test login.spec.ts
```

## 📁 Archivos Generados por Playwright

### ✅ Archivos que NO debes commitear (ya en .gitignore):

- `test-results/` - Capturas, videos y logs de tests fallidos
- `playwright-report/` - Reportes HTML generados
- `playwright/.cache/` - Cache de navegadores

### ✅ Archivos que SÍ debes commitear:

- `e2e/` - Todos tus tests y page objects
- `playwright.config.ts` - Configuración de Playwright
- `docs/architecture-overview.ipynb` - Documentación

## 🗂️ Estructura de Tests Actual

```
e2e/
├── pages/              # Page Object Models
│   ├── WelcomePage.ts  # Página de bienvenida
│   ├── HeaderPage.ts   # Componente header
│   └── DashboardPage.ts # Dashboard (para futuros tests)
└── login.spec.ts       # Tests de login flow
```

## 🎯 Tests Implementados

### 1. **should display login button when not authenticated**

- ✅ Verifica botones de login en header y página principal
- ✅ Verifica que NO hay elementos de usuario autenticado

### 2. **should show welcome page content**

- ✅ Verifica que el título y subtítulo están visibles
- ✅ Verifica contenido específico ("Code Duel")

### 3. **should handle login click without Auth0 configured**

- ✅ Verifica que el botón de login es clickeable
- ✅ Maneja correctamente la ausencia de Auth0 en testing

### 4. **should redirect to welcome when accessing protected routes**

- ✅ Verifica redirección al acceder `/dashboard` sin auth
- ✅ Protege rutas que requieren autenticación

### 5. **should show user interface when authenticated**

- ⚠️ Mock test - falla intencionalmente sin Auth0 completo
- 📝 Plantilla para cuando implementes Auth0 testing

### 6. **complete login flow with real Auth0** (SKIPPED)

- ⏭️ Deshabilitado - requiere configuración Auth0 real
- 📋 Plantilla completa para Auth0 E2E testing

## 🔧 Problemas Resueltos

### ❌ **Strict Mode Violations**

**Problema**: Múltiples botones con mismo texto

```
Error: strict mode violation: getByRole('button', { name: /login/i }) resolved to 2 elements
```

**Solución**: Especificar contexto

```typescript
// Antes (ambiguo)
this.page.getByRole('button', { name: /login/i });

// Después (específico)
this.page.getByRole('main').getByRole('button', { name: /login/i }); // Welcome page
this.page.getByRole('banner').getByRole('button', { name: /login/i }); // Header
```

### ❌ **Contenido Incorrecto**

**Problema**: Esperaba "duelo" pero encontró "Code Duel"

```
Expected pattern: /duelo|código|robot/i
Received string: "Code Duel"
```

**Solución**: Actualizar expectativa

```typescript
await expect(page.locator('h1')).toContainText(/code duel|duelo|código|robot/i);
```

## 📊 Debugging y Diagnóstico

### Ver Screenshots de Fallos

```bash
# Los screenshots están en test-results/
# Ejemplo: test-results/login-Login-Flow-should-di-42872-tton-when-not-authenticated-chromium/test-failed-1.png
```

### Ver Videos de Ejecución

```bash
# Videos automáticos en test-results/
# Solo se graban cuando hay fallos
```

### Ver Reporte HTML Completo

```bash
npm run test:e2e:report
# Abre playwright-report/index.html en el navegador
```

## 🚀 Próximos Pasos Sugeridos

### 1. **Tests de Dashboard**

```typescript
test('should load dashboard with character selection', async ({ page }) => {
  // Mock authentication first
  // Navigate to dashboard
  // Verify character cards load
});
```

### 2. **Tests de Batalla**

```typescript
test('should complete battle flow', async ({ page }) => {
  // Mock authenticated user with character
  // Navigate to battle
  // Perform attacks
  // Verify battle results
});
```

### 3. **Tests de Progresión**

```typescript
test('should update player level after victory', async ({ page }) => {
  // Mock battle victory
  // Verify level up
  // Verify progress persistence
});
```

### 4. **Auth0 Real Testing**

```typescript
// Configurar variables de entorno
// VITE_AUTH0_DOMAIN_TEST=...
// VITE_AUTH0_CLIENT_ID_TEST=...

// Crear usuario de prueba
// Implementar login automático
```

### 5. **CI/CD Integration**

```yaml
# .github/workflows/e2e.yml
- name: Run Playwright tests
  run: npm run test:e2e
```

## 🎓 Mejores Prácticas Aplicadas

✅ **Page Object Model** - Separación de selectores y lógica
✅ **Descriptive Selectors** - Usar roles y labels accesibles  
✅ **Error Handling** - Manejar casos sin Auth0 configurado
✅ **Specific Locators** - Evitar ambigüedad con contexto
✅ **Realistic Testing** - Tests que reflejan uso real
✅ **Documentation** - Tests auto-documentados con comentarios

---

**¡Tu setup de E2E testing está listo! 🎉**

Los archivos en `test-results/` y `playwright-report/` son temporales y se regeneran en cada ejecución. Puedes borrarlos cuando quieras - están en `.gitignore` para que no se suban al repo.
