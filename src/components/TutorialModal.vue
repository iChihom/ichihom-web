<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-info">
          <img :src="item.image" :alt="item.name" class="dish-image" />
          <div>
            <h2 class="modal-title">{{ item.name }}</h2>
            <p class="modal-subtitle">制作教程</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="ingredients-summary">
          <h3 class="summary-title">所需食材</h3>
          <div class="ingredients-tags">
            <span v-for="ingredient in item.ingredients" :key="ingredient.name" class="ingredient-tag">
              {{ ingredient.name }} ({{ ingredient.amount }}{{ ingredient.unit }})
            </span>
          </div>
        </div>

        <div class="tutorial-content">
          <h3 class="tutorial-title">制作步骤</h3>
          <div class="steps-container">
            <div v-for="(step, index) in item.tutorial" :key="index" class="step-card">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-text">{{ step }}</div>
            </div>
          </div>
        </div>

        <div class="tips-section">
          <h3 class="tips-title">小贴士</h3>
          <div class="tips-list">
            <div class="tip-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 7v4M10 13h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>准备好所有食材后再开始烹饪</span>
            </div>
            <div class="tip-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 7v4M10 13h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>注意火候控制，避免糊锅</span>
            </div>
            <div class="tip-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 7v4M10 13h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>根据个人口味调整调料用量</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-btn" @click="$emit('close')">
          知道了
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

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e7e5e4;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dish-image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 4px 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #78716c;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f7ff;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #78716c;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e7e5e4;
  color: #1c1917;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.ingredients-summary {
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 12px 0;
}

.ingredients-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ingredient-tag {
  font-size: 0.875rem;
  padding: 6px 12px;
  background: white;
  color: #374151;
  border-radius: 8px;
  border: 1px solid #e7e5e4;
  font-weight: 500;
}

.tutorial-content {
  margin-bottom: 32px;
}

.tutorial-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 16px 0;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background: #f8f7ff;
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  transition: all 0.2s ease;
}

.step-card:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.step-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text {
  flex: 1;
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  padding-top: 6px;
}

.tips-section {
  padding: 20px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.1);
}

.tips-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1c1917;
  margin: 0 0 12px 0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  color: #374151;
}

.tip-item svg {
  color: #f59e0b;
  flex-shrink: 0;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e7e5e4;
}

.action-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

@media (max-width: 640px) {
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
  }
}
</style>
