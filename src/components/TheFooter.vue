<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <p class="copyright">
          &copy; {{ currentYear }} Chihom Know. All rights reserved.
        </p>
        <div class="social-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="social-link">
            GitHub
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #f8f7ff;
  border-top: 1px solid #e7e5e4;
  padding: 32px 0;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.social-link:hover {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
