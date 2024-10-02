<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <!-- 左側品牌標誌 -->
      <a class="navbar-brand" href="#">豪讚讚買到賺到</a>

      <!-- 中間搜尋列 -->
      <form class="d-flex flex-grow-1 mx-4">
        <div class="input-group">
          <input class="form-control form-control-lg" type="search" placeholder="本日加碼優惠 水果全面限時九折" aria-label="搜尋">
          <button class="btn btn-primary border-white" type="submit">
            <i class="bi bi-search text-white"></i>
          </button>
        </div>
      </form>

      <!-- 右側購物車 -->
      <div class="navbar-nav">
        <a class="nav-link " href="#">
          <div class="position-relative">
            <i class="bi bi-cart fs-4 "></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ cartItemCount }}
              <span class="visually-hidden">購物車商品數量</span>
            </span>
          </div>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const cartItemCount = ref(0) // 這裡應該與您的購物車狀態管理邏輯連接
</script>

<style scoped>
.navbar-nav .nav-link {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}
</style>