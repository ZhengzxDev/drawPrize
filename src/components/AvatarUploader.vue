<template>
    <div class="uploader__cntr">
        <!-- 触发选择图片 -->

        <div class="uploader__main" @click="triggerFileInput" v-if="!imageUrl">
            <el-icon>
                <Plus />
            </el-icon>
        </div>

        <!-- 隐藏的文件输入框 -->
        <input type="file" ref="fileInputRef" accept="image/*" @change="onFileChange" style="display: none" />

        <!-- 图片显示区域 -->
        <div class="image__cntr" v-if="imageUrl" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <div class="image__ctrl" v-if="isHovering">
                <el-button icon="Delete" type="plain" @click="onClickDeleteImage"></el-button>
            </div>
            <el-image style="height:100%;width:100%" :src="imageUrl" />
            <!-- <img v-if="imageUrl" :src="imageUrl" alt="预览" class="image" /> -->
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isHovering = ref(false);
const imageUrl = defineModel<string>('imageUrl');
const fileInputRef = ref<HTMLInputElement | null>(null);

// 点击按钮触发 file input
const triggerFileInput = () => {
    fileInputRef.value?.click();
};

// 当文件发生变化时，读取并设置预览图
const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            imageUrl.value = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const onClickDeleteImage = () => {
    imageUrl.value = '';
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
}
</script>

<style scoped lang="scss">
.uploader__cntr {
    height: 70px;
    width: 70px;
}

.uploader__main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 2px dashed #999;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3 ease-in;
}

.uploader__main:hover {
    background-color: #beefff;
    cursor: pointer;
}

.image__cntr {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 5px;
    overflow: hidden;

    .image__ctrl {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    }
}



.image {
    width: 100%;
    height: 100%;
    object-fit: fill;
}
</style>