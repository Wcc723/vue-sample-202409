<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';

console.log('Env', import.meta.env.VITE_APP_URL, import.meta.env.VITE_APP_PATH);

const products = ref([]);
const categories = ref(['全部']);
const selectedCategory = ref('全部');

onMounted(async () => {
  try {
    products.value = await (await axios.get(`${import.meta.env.VITE_APP_URL}/v2/api/${import.meta.env.VITE_APP_PATH}/products/all`)).data.products
    console.log(products.value);
    categories.value = ['全部', ...new Set(products.value.map(item => item.category))];

  } catch (error) {
    console.log(error);
  }
})

const filteredProducts = computed(() => {
  if (selectedCategory.value === '全部') {
    return products.value; // 如果選擇 "全部"，顯示所有產品
  }
  return products.value.filter(product => product.category === selectedCategory.value);
});
</script>

<template>
  <NavbarComponent></NavbarComponent>
  <div class="container mt-3" style="max-width: 1200px;">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">首頁</a></li>
        <li class="breadcrumb-item active" aria-current="page">產品列表</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-md-3">
        <div class="list-group">
          <button type="button" class="list-group-item list-group-item-action"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
            v-for="(category, index) in categories" :key="index">
            {{ category }}
          </button>
        </div>
      </div>
      <div class="col-md-9">
        <div class="row g-3" >
          <div class="col-md-4" v-for="product in filteredProducts" :key="product.id">
            <div class="card">
              <img :src="product.imageUrl" class="card-img-top object-fit-cover" height="250" alt="產品圖片">
              <div class="card-body">
                <h5 class="card-title">{{ product.title }}</h5>
                <p class="card-text text-muted">{{ product.description}}</p>
                <div class="d-flex justify-content-between">
                  <div class="text-muted text-decoration-line-through" v-if="product.origin_price !== product.price">
                    ${{ product.origin_price }}
                  </div>
                  <div class="fw-bold ms-auto">
                    ${{ product.price }}
                  </div>
                </div>
                <h6 class="card-subtitle mb-2 text-muted"></h6>
                <RouterLink :to="`/product/${product.id}`" class="btn btn-outline-primary w-100">查看詳情</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thumbnail {
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
}
.active-thumbnail {
  border-color: #007bff;
}

.bi-chevron-right {
  font-size: 0.8em;
  color: #6c757d;
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制顯示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>