<template>
  <div class="shopping-list-page">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10M6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        返回菜单
      </button>
      <h1 class="page-title">采购清单</h1>
    </div>

    <div class="page-content">
      <div class="summary-section">
        <div class="summary-card">
          <div class="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-label">已选菜品</span>
            <span class="summary-value">{{ cartItems.length }} 道菜</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 11H5M19 11L16 8M19 11L16 14M5 11L8 8M5 11L8 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="summary-info">
            <span class="summary-label">需要食材</span>
            <span class="summary-value">{{ mergedIngredients.length }} 种</span>
          </div>
        </div>
      </div>

      <div class="main-section">
        <div class="ingredients-section">
          <div class="section-header">
            <h2 class="section-title">食材清单</h2>
            <span class="section-count">共 {{ mergedIngredients.length }} 种</span>
          </div>
          <div class="ingredients-table">
            <div class="table-header">
              <div class="table-cell cell-name">食材名称</div>
              <div class="table-cell cell-amount">数量</div>
              <div class="table-cell cell-unit">单位</div>
              <div class="table-cell cell-sources">来源菜品</div>
            </div>
            <div class="table-body">
              <div v-for="ingredient in mergedIngredients" :key="ingredient.name" class="table-row">
                <div class="table-cell cell-name" data-label="食材名称">{{ ingredient.name }}</div>
                <div class="table-cell cell-amount" data-label="数量">{{ ingredient.totalAmount }}</div>
                <div class="table-cell cell-unit" data-label="单位">{{ ingredient.unit }}</div>
                <div class="table-cell cell-sources" data-label="来源菜品">
                  <span v-for="source in ingredient.sources" :key="source" class="source-text">
                    {{ source }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dishes-section">
          <div class="section-header">
            <h2 class="section-title">已选菜品</h2>
            <span class="section-count">共 {{ cartItems.length }} 道菜</span>
          </div>
          <div class="dishes-table">
            <div class="table-header">
              <div class="table-cell cell-dish-name">菜品名称</div>
              <div class="table-cell cell-dish-price">单价</div>
              <div class="table-cell cell-dish-quantity">数量</div>
              <div class="table-cell cell-dish-action">操作</div>
            </div>
            <div class="table-body">
              <div v-for="item in cartItems" :key="item.id" class="table-row">
                <div class="table-cell cell-dish-name" data-label="菜品名称">
                  <div class="dish-name-row">
                    <img :src="item.image" :alt="item.name" class="dish-thumb" />
                    <span>{{ item.name }}</span>
                  </div>
                </div>
                <div class="table-cell cell-dish-price" data-label="单价">¥{{ item.price }}</div>
                <div class="table-cell cell-dish-quantity" data-label="数量">x{{ item.quantity }}</div>
                <div class="table-cell cell-dish-action" data-label="操作">
                  <button class="view-tutorial-btn" @click="showTutorial(item)">
                    查看教程
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <button class="action-btn secondary" @click="exportList">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1 1h16v16H1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 9h8M5 5h8M5 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        导出清单
      </button>
      <button class="action-btn primary" @click="goBack">
        完成
      </button>
    </div>

    <TutorialModal
      v-if="showTutorialModal"
      :item="selectedDish"
      @close="showTutorialModal = false"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TutorialModal from '../components/TutorialModal.vue'

const router = useRouter()
const route = useRoute()

const cartItems = ref([])
const showTutorialModal = ref(false)
const selectedDish = ref(null)

onMounted(() => {
  if (route.query.items) {
    try {
      cartItems.value = JSON.parse(route.query.items)
    } catch (e) {
      console.error('Failed to parse cart items:', e)
    }
  }
})

const mergedIngredients = computed(() => {
  const ingredientMap = new Map()

  cartItems.value.forEach(item => {
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
  text += `已选菜品：${cartItems.value.length} 道菜\n`
  text += `需要食材：${mergedIngredients.value.length} 种\n\n`
  text += '=== 食材清单 ===\n'

  mergedIngredients.value.forEach(ingredient => {
    text += `${ingredient.name}: ${ingredient.totalAmount} ${ingredient.unit}\n`
    text += `  用于: ${ingredient.sources.join(', ')}\n`
  })

  text += '\n=== 已选菜品 ===\n'
  cartItems.value.forEach(item => {
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

const goBack = () => {
  router.push({ name: 'menu' })
}
</script>

<style scoped>
.shopping-list-page {
  min-height: calc(100vh - 64px);
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 40px;
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #666666;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.back-btn:hover {
  background: #f8f8f8;
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f8f8f8;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
}

.summary-icon {
  width: 48px;
  height: 48px;
  background: #1a1a1a;
  border-radius: 10px;
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
  font-size: 0.875rem;
  color: #666666;
  font-weight: 500;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.main-section {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.ingredients-section,
.dishes-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.section-count {
  font-size: 0.875rem;
  color: #666666;
  font-weight: 500;
}

.ingredients-table,
.dishes-table {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 2fr;
  background: #f8f8f8;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #1a1a1a;
}

.dishes-table .table-header {
  grid-template-columns: 3fr 1fr 1fr 1fr;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 2fr;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background 0.15s ease;
}

.dishes-table .table-row {
  grid-template-columns: 3fr 1fr 1fr 1fr;
}

.table-row:hover {
  background: #fafafa;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  font-size: 0.875rem;
  color: #333333;
  font-weight: 400;
}

.cell-name {
  font-weight: 500;
  color: #1a1a1a;
}

.cell-amount {
  font-weight: 600;
  color: #1a1a1a;
}

.cell-unit {
  color: #666666;
}

.cell-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.source-text {
  font-size: 0.8125rem;
  color: #666666;
  background: #f8f8f8;
  padding: 4px 10px;
  border-radius: 4px;
}

.cell-dish-name {
  font-weight: 500;
  color: #1a1a1a;
}

.dish-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dish-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.cell-dish-price {
  font-weight: 500;
  color: #1a1a1a;
}

.cell-dish-quantity {
  color: #666666;
}

.cell-dish-action {
  display: flex;
  justify-content: flex-end;
}

.view-tutorial-btn {
  padding: 6px 16px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.view-tutorial-btn:hover {
  background: #000000;
}

.page-footer {
  display: flex;
  gap: 16px;
  padding: 24px 40px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
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
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
}

.action-btn.secondary:hover {
  border-color: #1a1a1a;
  background: #f8f8f8;
}

.action-btn.primary {
  background: #1a1a1a;
  color: white;
}

.action-btn.primary:hover {
  background: #000000;
}

@media (max-width: 1024px) {
  .main-section {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .dishes-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-header,
  .page-content,
  .page-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .summary-section {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .summary-card {
    padding: 16px;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .table-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-cell::before {
    content: attr(data-label);
    font-weight: 500;
    color: #666666;
  }

  .cell-name::before {
    content: '食材名称';
  }

  .cell-amount::before {
    content: '数量';
  }

  .cell-unit::before {
    content: '单位';
  }

  .cell-sources::before {
    content: '来源菜品';
  }

  .cell-dish-name::before {
    content: '菜品名称';
  }

  .cell-dish-price::before {
    content: '单价';
  }

  .cell-dish-quantity::before {
    content: '数量';
  }

  .cell-dish-action::before {
    content: '操作';
  }

  .dish-name-row {
    justify-content: flex-start;
  }

  .cell-sources {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-footer {
    flex-direction: column;
  }

  .page-title {
    font-size: 1.25rem;
  }
}
</style>