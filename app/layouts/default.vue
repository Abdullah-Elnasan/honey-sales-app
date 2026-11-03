<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand">
          <span class="brand-icon">🍯</span>
          <div>
            <h1 class="brand-name">حسابات العسل</h1>
            <p class="brand-sub">نظام إدارة المبيعات</p>
          </div>
        </div>
        <nav class="nav-tabs">
          <NuxtLink to="/" class="nav-tab" active-class="nav-tab--active">
            <span class="nav-icon">📅</span>
            <span>الفترات</span>
          </NuxtLink>
          <NuxtLink to="/sales" class="nav-tab" active-class="nav-tab--active">
            <span class="nav-icon">➕</span>
            <span>تسجيل بيع</span>
          </NuxtLink>
          <NuxtLink to="/records" class="nav-tab" active-class="nav-tab--active">
            <span class="nav-icon">📋</span>
            <span>سجل المبيعات</span>
          </NuxtLink>
          <NuxtLink to="/stats" class="nav-tab" active-class="nav-tab--active">
            <span class="nav-icon">📊</span>
            <span>الإحصائيات</span>
          </NuxtLink>
        </nav>
      </div>
    </header>
    
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  font-size: 2rem;
  line-height: 1;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink-900);
}

.brand-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.nav-tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-tabs::-webkit-scrollbar { display: none; }

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s;
  white-space: nowrap;
}

.nav-tab:hover {
  color: var(--text);
  background: var(--ink-50);
}

.nav-tab--active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.nav-icon { font-size: 1rem; }

.app-main {
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

@media (max-width: 640px) {
  .app-main {
    padding: 1rem;
  }
  .header-inner {
    padding: 0.75rem 1rem 0;
  }
  .brand-icon { font-size: 1.75rem; }
  .brand-name { font-size: 1.1rem; }
}
</style>