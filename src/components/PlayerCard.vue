<template>
    <div class="card__cntr">
        <div class="card__header" v-if="props.title"
            :style="{ backgroundColor: props.titleBgColor, color: props.titleColor }">
            {{ props.title }}
        </div>


        <div class="card__main" :class="{ bounce: isAnimating }">
            <img class="avatar-img" :src="currentPlayer.img" v-if="currentPlayer.img" />
            <div class="avatar" v-else>
                <CUIcon :size="25" color="white">
                    <IconUser />
                </CUIcon>
            </div>

            <div class="card__name">
                {{ currentPlayer.username || '待随机' }}
            </div>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import IconUser from "@/components/icons/IconUser.vue";
import CUIcon from "./general/CUIcon.vue";
import { usePlayerStore } from "@/stores/player";
import type { player } from "@/types/player";
import { useRuntimeStore } from "@/stores/runtime";

const props = defineProps({
    title: String,
    titleColor: String,
    titleBgColor: String,
})

const playerStore = usePlayerStore();
const runtimeStore = useRuntimeStore();
const currentPlayer = ref<player>({ username: "", img: "" });
const isAnimating = ref(false);
const intervalRef = ref<number | null>(null);

const getRandomPlayer = () => {
    const players = playerStore.players;
    if (players.length === 0) return;
    const randomIndex = Math.floor(Math.random() * players.length);
    currentPlayer.value = players[randomIndex];

    // 触发动画
    isAnimating.value = false;
    requestAnimationFrame(() => {
        isAnimating.value = true;
    });
};

const startShuffle = () => {
    stopShuffle(); // 避免重复定时器
    getRandomPlayer(); // 马上随机一次
    intervalRef.value = setInterval(() => {
        getRandomPlayer();
    }, 150); // 每 300ms 切换
};

const stopShuffle = () => {
    if (intervalRef.value !== null) {
        clearInterval(intervalRef.value);
        intervalRef.value = null;
        // 从不在集合里的player随机选一个
        const p = runtimeStore.getRandomSelect()
        if (p === null) {
            currentPlayer.value = {
                username: "待随机",
                img: ""
            }
        } else {
            currentPlayer.value = p
        }
        isAnimating.value = false;
        requestAnimationFrame(() => {
            isAnimating.value = true;
        });

    }
};

const reset = () => {
    currentPlayer.value = {
        username: "待随机",
        img: ""
    }
}


// 防止组件卸载后定时器未清理
onBeforeUnmount(() => {
    stopShuffle();
});


defineExpose({
    stopShuffle,
    startShuffle,
    reset
})

</script>

<style scoped lang="scss">
.card__cntr {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-weight: bold;
    font-size: 20px;
    overflow: hidden;
    border-radius: 8px;
    width: 140px;
    border: 1px solid #efefef;
    padding-bottom: 10px;
    background-color: white;

    .card__header {
        line-height: 30px;
        height: 30px;
        width: 100%;
        background-color: rgb(255, 176, 38);
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 10px;
        color: white;
    }
}

.card__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.avatar {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    background: linear-gradient(to bottom, #7fc8ff, #49e8be);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    margin: 5px;
}

.card__cntr:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.bounce {
    animation: bounce-scale 0.3s ease;
}

@keyframes bounce-scale {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    30% {
        transform: scale(1.3);
        opacity: 0.5;
    }

    60% {
        transform: scale(0.9);
        opacity: 0.8;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.avatar-img {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    margin: 5px;
    overflow: hidden;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
</style>