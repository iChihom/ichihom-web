<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">采购清单</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="summary-section">
          <div class="summary-card">
            <div class="summary-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4v24M4 16h24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="summary-info">
              <span class="summary-label">已选菜品</span>
              <span class="summary-value">{{ cartItems.length }} 道菜</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L20 12H30L22 18L25 28L16 22L7 28L10 18L2 12H12L16 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="summary-info">
              <span class="summary-label">需要食材</span>
              <span class="summary-value">{{ mergedIngredients.length }} 种</span>
            </div>
          </div>
        </div>

        <div class="ingredients-section">
          <h3 class="section-title">食材清单</h3>
          <div class="ingredients-list">
            <div v-for="ingredient in mergedIngredients" :key="ingredient.name" class="ingredient-item">
              <div class="ingredient-info">
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span class="ingredient-amount">{{ ingredient.totalAmount }} {{ ingredient.unit }}</span>
              </div>
              <div class="ingredient-sources">
                <span v-for="source in ingredient.sources" :key="source" class="source-tag">
                  {{ source }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="dishes-section">
          <h3 class="section-title">已选菜品</h3>
          <div class="dishes-list">
            <div v-for="item in cartItems" :key="item.id" class="dish-item">
              <div class="dish-info">
                <span class="dish-name">{{ item.name }}</span>
                <span class="dish-quantity">x{{ item.quantity }}</span>
              </div>
              <button class="view-tutorial-btn" @click="showTutorial(item)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8h14M8 1v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                查看教程
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-btn secondary" @click="exportList">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1h16v16H1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 9h8M5 5h8M5 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          导出清单
        </button>
        <button class="action-btn primary" @click="$emit('close')">
          完成
        </button>
      </div>
    </div>

    <TutorialModal
      v-if="showTutorialModal"
      :item="selectedDish"
      @close="showTutorialModal = false"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import TutorialModal from './TutorialModal.vue'

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close'])

const showTutorialModal = ref(false)
const selectedDish = ref(null)

const mergedIngredients = computed(() => {
  const ingredientMap = new Map()

  props.cartItems.forEach(item => {
    item.ingredients.forEach(ingredient => {
      const key = ingredient.name
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          name: ingredient.name,
          totalAmount: 0,
          unit: ingredient.unit,
          sources: []
        })
      }

      const existing = ingredientMap.get(key)
      existing.totalAmount += parseFloat(ingredient.amount) || 0
      if (!existing.sources.includes(item.name)) {
        existing.sources.push(item.name)
      }
    })
  })

  return Array.from(ingredientMap.values()).sort((a, b) => {
    return b.totalAmount - a.totalAmount
  })
})

const showTutorial = (item) => {
  selectedDish.value = item
  showTutorialModal.value = true
}

const exportList = () => {
  let text = '采购清单\n\n'
  text += `已选菜品：${props.cartItems.length} 道菜\n`
  text += `需要食材：${mergedIngredients.value.length} 种\n\n`
  text += '=== 食材清单 ===\n'

  mergedIngredients.value.forEach(ingredient => {
    text += `${ingredient.name}: ${ingredient.totalAmount} ${ingredient.unit}\n`
    text += `  用于: ${ingredient.sources.join(', ')}\n`
  })

  text += '\n=== 已选菜品 ===\n'
  props.cartItems.forEach(item => {
    text += `${item.name} x${item.quantity}\n`
  })

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '采购清单.txt'
  link.click()
  URL.revokeObjectURL(url)
}
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
  max-width: 720px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
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
  padding: 24px;
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.summary-icon {
  width: 40px;
  height: 40px;
  background: #111827;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.ingredients-section,
.dishes-section {
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

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredient-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.ingredient-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ingredient-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
}

.ingredient-amount {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.ingredient-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.source-tag {
  font-size: 0.75rem;
  padding: 4px 8px;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-weight: 500;
}

.dishes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.dish-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dish-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
}

.dish-quantity {
  font-size: 0.8125rem;
  color: #6b7280;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

.view-tutorial-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.view-tutorial-btn:hover {
  background: #f9fafb;
  border-color: #111827;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f3f4f6;
}

.action-btn {
  flex: 1;
  padding: 12px;
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

.action-btn.secondary {
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  border-color: #111827;
  background: #f9fafb;
}

.action-btn.primary {
  background: #111827;
  color: white;
}

.action-btn.primary:hover {
  background: #000000;
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-content {
    max-height: 90vh;
    border-radius: 12px 12px 0 0;
  }

  .summary-section {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
