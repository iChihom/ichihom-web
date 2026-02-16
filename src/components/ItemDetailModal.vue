<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="modal-body">
        <div class="item-image">
          <img :src="item.image" :alt="item.name" />
          <div v-if="item.popular" class="popular-badge">热门</div>
          <div v-if="item.spicy > 0" class="spicy-badge">
            <span v-for="i in item.spicy" :key="i">🌶️</span>
          </div>
        </div>

        <div class="item-info">
          <h1 class="item-name">{{ item.name }}</h1>
          <p class="item-description">{{ item.description }}</p>
          <div class="item-price">¥{{ item.price }}</div>

          <div class="ingredients-section">
            <h3 class="section-title">所需食材</h3>
            <div class="ingredients-grid">
              <div v-for="ingredient in item.ingredients" :key="ingredient.name" class="ingredient-card">
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span class="ingredient-amount">{{ ingredient.amount }} {{ ingredient.unit }}</span>
              </div>
            </div>
          </div>

          <div class="tutorial-section">
            <h3 class="section-title">制作教程</h3>
            <div class="tutorial-list">
              <div v-for="(step, index) in item.tutorial" :key="index" class="tutorial-step">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">{{ step }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="add-to-cart-btn" @click="$emit('add-to-cart', item)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          添加到购物车
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'add-to-cart'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  z-index: 10;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: #f9fafb;
  border-color: #111827;
  color: #111827;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.item-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f9fafb;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popular-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #111827;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spicy-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-info {
  padding: 24px;
}

.item-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
  letter-spacing: -0.01em;
}

.item-description {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.item-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 32px;
}

.ingredients-section,
.tutorial-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px 0;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}

.ingredient-card {
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ingredient-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.ingredient-amount {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

.tutorial-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tutorial-step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  width: 28px;
  height: 28px;
  background: #111827;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.6;
  padding-top: 2px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #f3f4f6;
}

.add-to-cart-btn {
  width: 100%;
  padding: 14px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn:hover {
  background: #000000;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-content {
    max-height: 90vh;
    border-radius: 12px 12px 0 0;
  }

  .item-image {
    height: 180px;
  }

  .item-info {
    padding: 20px;
  }

  .item-name {
    font-size: 1.25rem;
  }

  .item-price {
    font-size: 1.25rem;
  }

  .ingredients-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    padding: 20px;
  }
}
</style>
