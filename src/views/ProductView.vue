<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Carousel } from 'bootstrap';

console.log('Env', import.meta.env.VITE_APP_URL, import.meta.env.VITE_APP_PATH);
const router = useRouter();
const { id } = router.currentRoute.value?.params ?? {};

console.log(id);
const product = ref({});
const category = ref('');
const quantity = ref(1);

onMounted(async () => {
  try {
    product.value = await (await axios.get(`${import.meta.env.VITE_APP_URL}/v2/api/${import.meta.env.VITE_APP_PATH}/product/${id}`)).data.product;
    console.log(product.value);
    category.value = product.value.category;

    // 確保 imagesUrl 存在，並將 imageUrl 添加進去
    if (!product.value.imagesUrl) {
      product.value.imagesUrl = [];
    }
    if (product.value.imageUrl && !product.value.imagesUrl.includes(product.value.imageUrl)) {
      product.value.imagesUrl.unshift(product.value.imageUrl); // 將 imageUrl 加入 imagesUrl 陣列開頭，且不重複
    }

  } catch (error) {
    console.log(error);
  }
})


const addToCart = () => {
  console.log(`加入購物車，數量：${quantity.value}`);
};

const buyNow = () => {
  console.log('直接購買');
};

// 設定目前點選的縮圖
const activeIndex = ref(0); 
const setActiveImage = (index) => {
  activeIndex.value = index;
  const carouselElement = document.querySelector('#productCarousel');
  const carousel = Carousel.getInstance(carouselElement) || new bootstrap.Carousel(carouselElement);
  carousel.to(index); // 切換到指定的圖片
};
</script>

<template>
  <NavbarComponent></NavbarComponent>
  <div class="container mt-3" style="max-width: 1200px;">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><RouterLink to="/">首頁</RouterLink></li>
        <li class="breadcrumb-item"><RouterLink to="/">{{ product.category || '分類' }}</RouterLink></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product.title || '產品名稱' }}</li>
      </ol>
    </nav>
    <div class="card border-0 bg-white shadow-sm pb-3">
      <div class="row g-0">
        <!-- 左側產品圖片 -->
        <div class="col-md-6">
          <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
            <!-- 輪播圖片 -->
            <div class="carousel-inner">
              <div
                v-for="(image, index) in product.imagesUrl"
                :key="index"
                class="carousel-item"
                :class="{ active: index === 0 }"
              >
                <img :src="image" class="d-block w-100 object-fit-cover" height="600" alt="產品圖片">
              </div>
            </div>

            <!-- 左右切換按鈕 -->
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">上一張</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">下一張</span>
            </button>
          </div>

          <!-- 縮略圖導航 -->
          <div class="d-flex justify-content-center mt-2">
            <div v-for="(image, index) in product.imagesUrl" :key="index" class="mx-1">
              <img
                :src="image"
                @click="setActiveImage(index)"
                class="thumbnail"
                :class="{ 'active-thumbnail': index === activeIndex }"
                width="60"
                height="60"
                alt="產品圖片"
              />
            </div>
          </div>
        </div>

        <!-- 右側產品資訊 -->
        <div class="col-md-6">
          <div class="card-body">
            <h2 class="card-title">{{ product.title || '產品名稱' }}</h2>
            <p class="card-text">{{ product.content || '無法取得產品描述' }}</p>
            <p class="card-text">
              <span class="text-muted text-decoration-line-through" v-if="product.origin_price !== product.price">原價：${{ product.origin_price }}</span>
              <span class="fs-3 text-danger ms-2">優惠價：${{ product.price }}</span>
            </p>
            <p class="card-text"><small class="text-muted">規格：每{{ product.unit || '未知單位' }}</small></p>
            <div class="mb-3">
              <label for="quantity" class="form-label">選購數量：</label>
              <select class="form-control" id="quantity" v-model="quantity">
                <option :value="i" v-for="i in 10" :key="i">
                  {{ i }} 箱
                </option>
              </select>
            </div>
            <p class="card-text"><small class="text-muted">已售出：{{ product.num || 0 }} 箱</small></p>
            <div class="d-flex gap-2 justify-content-between mb-3">
              <button class="btn btn-outline-primary w-100" type="button" @click="addToCart">
                <i class="bi bi-cart-plus"></i> 加入購物車
              </button>
              <button class="btn btn-primary w-100 text-white" type="button" @click="buyNow">
                <i class="bi bi-bag-check"></i> 直接購買
              </button>
            </div>
            <!-- 新增的資訊區塊 -->
            <div class="mt-4 text-secondary">
              <h5>付款方式</h5>
              <p><small>信用卡、PayPal、銀行轉帳</small></p>
              <h5>運送說明</h5>
              <p><small>全台灣免運費，離島需加付運費。預計 3-5 個工作天到貨。</small></p>
              <h5>退換貨政策</h5>
              <p><small>收到商品後 7 天內可申請退換貨，但需保持商品完整。</small></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品規格 -->
    <div class="card border-0 bg-white shadow-sm mt-4">
      <div class="card-body">
        <h3 class="card-title">商品規格</h3>
        <div class="row">
          <div class="col-md-6">
            <p><strong>分類：</strong>{{ product.category || '未知分類' }}</p>
            <p><strong>商品數量：</strong>{{ product.num || '未知數量' }} 箱</p>
            <p><strong>產地：</strong>{{ product.origin || '未知產地' }}</p>
            <p><strong>出貨地：</strong>{{ product.shippingFrom || '未知出貨地' }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>商品描述：</strong>{{ product.description || '無法取得描述' }}</p>
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
</style>