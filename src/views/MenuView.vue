<template>
  <div class="menu-page">
    <div class="menu-container">
      <div class="menu-sidebar">
        <div class="category-nav">
          <div class="category-list">
            <button
              v-for="category in menuCategories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <span class="category-name">{{ category.name }}</span>
              <span v-if="selectedCategory === category.id" class="category-indicator"></span>
            </button>
          </div>
        </div>

        <div class="cart-section">
          <div class="cart-header">
            <h3 class="cart-title">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              购物车
            </h3>
            <span class="cart-count">{{ cartTotalCount }}</span>
          </div>

          <div v-if="cartItems.length === 0" class="cart-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4v16m0 0v16m0-16h16m-16 0H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>购物车是空的</p>
          </div>

          <div v-else class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="cart-item-info">
                <span class="cart-item-name">{{ item.name }}</span>
                <span class="cart-item-price">¥{{ item.price }}</span>
              </div>
              <div class="cart-item-controls">
                <button class="quantity-btn" @click="decreaseQuantity(item)">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button class="quantity-btn" @click="increaseQuantity(item)">+</button>
              </div>
            </div>
          </div>

          <div v-if="cartItems.length > 0" class="cart-footer">
            <div class="cart-total">
              <span>总计</span>
              <span class="total-price">¥{{ cartTotalPrice }}</span>
            </div>
            <button class="checkout-btn" @click="goToShoppingList">
              查看采购清单
            </button>
          </div>
        </div>
      </div>

      <div class="menu-content">
        <div class="content-header">
          <h1 class="page-title">{{ getCurrentCategoryName() }}</h1>
          <p class="page-subtitle">{{ getCurrentCategoryDescription() }}</p>
        </div>

        <div class="menu-list">
          <div
            v-for="item in currentItems"
            :key="item.id"
            class="menu-item-row"
            @click="showItemDetail(item)"
          >
            <div class="item-row-image">
              <img :src="item.image" :alt="item.name" />
              <div v-if="item.popular" class="popular-badge">热门</div>
              <div v-if="item.spicy > 0" class="spicy-badge">
                <span v-for="i in item.spicy" :key="i">🌶️</span>
              </div>
            </div>
            <div class="item-row-content">
              <div class="item-row-main">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-description">{{ item.description }}</p>
              </div>
              <div class="item-row-footer">
                <span class="item-price">¥{{ item.price }}</span>
                <button
                  class="add-btn"
                  :class="{ added: isInCart(item.id) }"
                  @click.stop="addToCart(item)"
                >
                  {{ isInCart(item.id) ? '已添加' : '添加' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ShoppingListModal
      v-if="showShoppingList"
      :cart-items="cartItems"
      @close="showShoppingList = false"
    />

    <ItemDetailModal
      v-if="showDetail"
      :item="selectedItem"
      @close="showDetail = false"
      @add-to-cart="addToCartFromDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { menuCategories, getItemsByCategory } from '../data/menuData'
import ItemDetailModal from '../components/ItemDetailModal.vue'

const router = useRouter()
const selectedCategory = ref('main')
const cartItems = ref([])
const showDetail = ref(false)
const selectedItem = ref(null)

const currentItems = computed(() => {
  return getItemsByCategory(selectedCategory.value)
})

const cartTotalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const cartTotalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

const getCurrentCategoryName = () => {
  const category = menuCategories.find(c => c.id === selectedCategory.value)
  return category ? category.name : ''
}

const getCurrentCategoryDescription = () => {
  const category = menuCategories.find(c => c.id === selectedCategory.value)
  return category ? category.description : ''
}

const isInCart = (itemId) => {
  return cartItems.value.some(item => item.id === itemId)
}

const addToCart = (item) => {
  const existingItem = cartItems.value.find(i => i.id === item.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({ ...item, quantity: 1 })
  }
}

const removeFromCart = (itemId) => {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const increaseQuantity = (item) => {
  item.quantity++
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    removeFromCart(item.id)
  }
}

const showItemDetail = (item) => {
  selectedItem.value = item
  showDetail.value = true
}

const addToCartFromDetail = (item) => {
  addToCart(item)
  showDetail.value = false
}

const goToShoppingList = () => {
  router.push({ name: 'shopping-list', query: { items: JSON.stringify(cartItems.value) } })
}
</script>

<style scoped>
.menu-page {
  min-height: calc(100vh - 64px);
  background: #ffffff;
}

.menu-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  gap: 0;
  height: calc(100vh - 64px);
}

.menu-sidebar {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
}

.category-nav {
  padding: 24px 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.category-item:hover {
  background: #f0f0f0;
}

.category-item.active {
  background: white;
  font-weight: 600;
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #1a1a1a;
}

.category-name {
  font-size: 0.9375rem;
  color: #333333;
  text-align: left;
}

.category-item.active .category-name {
  color: #1a1a1a;
}

.category-indicator {
  width: 6px;
  height: 6px;
  background: #1a1a1a;
  border-radius: 50%;
}

.cart-section {
  background: white;
  padding: 20px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.cart-count {
  background: #1a1a1a;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
}

.cart-empty {
  text-align: center;
  padding: 40px 0;
  color: #999999;
  font-size: 0.875rem;
}

.cart-items {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
}

.cart-item-price {
  font-size: 0.8125rem;
  color: #666666;
  font-weight: 500;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333333;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.quantity {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
  min-width: 20px;
  text-align: center;
}

.cart-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-total span:first-child {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666666;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.checkout-btn:hover {
  background: #000000;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 32px 40px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: -0.01em;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: #666666;
  margin: 0;
  line-height: 1.5;
}

.menu-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-item-row {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.menu-item-row:hover {
  border-color: #e5e5e5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.item-row-image {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  overflow: hidden;
  background: #f8f8f8;
}

.item-row-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.menu-item-row:hover .item-row-image img {
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #1a1a1a;
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spicy-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-row-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-row-main {
  flex: 1;
}

.item-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.item-description {
  font-size: 0.875rem;
  color: #666666;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-row-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.item-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
}

.add-btn {
  padding: 8px 20px;
  background: white;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.add-btn:hover {
  background: #f8f8f8;
  border-color: #1a1a1a;
}

.add-btn.added {
  background: #1a1a1a;
  color: white;
  border-color: #1a1a1a;
}

@media (max-width: 1024px) {
  .menu-container {
    flex-direction: column;
    height: auto;
  }

  .menu-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    overflow-x: auto;
    overflow-y: visible;
  }

  .category-nav {
    padding: 16px 20px;
  }

  .category-list {
    flex-direction: row;
    gap: 8px;
  }

  .category-item {
    padding: 10px 16px;
    border-radius: 6px;
    background: #f8f8f8;
    flex-shrink: 0;
  }

  .category-item.active {
    background: #1a1a1a;
  }

  .category-item.active::before {
    display: none;
  }

  .category-item.active .category-name {
    color: white;
  }

  .category-item.active .category-indicator {
    background: white;
  }

  .cart-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    max-height: 60vh;
  }

  .menu-list {
    padding: 20px;
  }

  .item-row-image {
    width: 100px;
    height: 100px;
  }

  .item-row-content {
    padding: 12px;
  }

  .item-name {
    font-size: 0.9375rem;
  }

  .item-description {
    font-size: 0.8125rem;
    -webkit-line-clamp: 1;
  }

  .item-price {
    font-size: 1rem;
  }

  .content-header {
    padding: 24px 20px 16px;
  }
}
</style>
