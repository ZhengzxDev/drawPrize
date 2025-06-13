<template>
    <div class="draw__cntr">
        <div class="draw__header">
            <div class="draw__ctrl">
                <el-button type="primary" @click="onClickStart" v-if="!runtimeStore.shuffling">开始</el-button>
                <el-button type="danger" @click="onClickStop" v-else>结束</el-button>
                <el-button @click="onClickReset">重置卡片</el-button>
                <el-button @click="onClickSetting">设置</el-button>
                <el-button icon="Plus" @click="onClickScale(1)">放大</el-button>
                <el-button icon="Minus" @click="onClickScale(-1)">缩小</el-button>
            </div>
            <div class="draw__logo">
                <img src="@/assets/imgs/logo.png" style="width:150px">
            </div>
        </div>
        <div class="draw__main" ref="mainRef">
            <div class="draw__content" ref="contentRef" :style="{
                '--main-scale': mainScale,
                transform: `scale(var(--main-scale))`
            }">
                <div class="single" v-if="settingStore.hasExtraGroup">
                    <PlayerCard :title="settingStore.extraGroupName" title-bg-color="rgb(2, 175, 5)" title-color="white"
                        :ref="el => playerCardRefs[0] = el" />
                </div>
                <div class="group">
                    <div class="group__cntr" v-for="i in Number(settingStore.groupCount)">
                        <div v-for="j in Number(settingStore.playerPerGroup)">
                            <PlayerCard :title="`${(i - 1) * settingStore.playerPerGroup + j}`"
                                :ref="el => playerCardRefs[(i - 1) * settingStore.playerPerGroup + j] = el" />
                            <div v-if="j < settingStore.playerPerGroup" class="group__vs-icon">vs</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="settingVisible" title="设置" width="500" draggable>
        <el-scrollbar height="400px">
            <el-form>
                <el-form-item label="made by">
                    🐻熊仔
                </el-form-item>
                <el-form-item label="包含独立组">
                    <el-switch v-model="settingStore.hasExtraGroup" />
                </el-form-item>
                <el-form-item label="独立组名">
                    <el-input v-model="settingStore.extraGroupName"></el-input>
                </el-form-item>
                <el-form-item label="组数">
                    <el-input v-model="settingStore.groupCount" type="number"></el-input>
                </el-form-item>
                <el-form-item label="组内玩家数">
                    <el-input v-model="settingStore.playerPerGroup" type="number"></el-input>
                </el-form-item>

                <el-form-item label="玩家">
                    <div class="player-info" v-for="player, idx in playerStore.players">
                        <div class="player-info-item">
                            名称
                            <el-input v-model="player.username" style="width:200px"></el-input>

                        </div>
                        <div clas="player-info-item">
                            头像
                            <AvatarUploader v-model:image-url="player.img" />
                        </div>
                        <el-button type="danger" @click="onClickRemove(idx)">删除</el-button>
                    </div>
                    <el-button icon="Plus" @click="onClickAddPlayer"></el-button>
                    <div style="margin-left: 10px;">共&nbsp;{{ playerStore.players.length }}&nbsp;位玩家</div>
                </el-form-item>
            </el-form>
        </el-scrollbar>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="settingVisible = false">
                    关闭
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CUIcon from "@/components/general/CUIcon.vue";
import IconUser from "@/components/icons/IconUser.vue";
import { usePlayerStore } from "@/stores/player.ts";
import { useSettingStore } from "@/stores/setting";
import AvatarUploader from "@/components/AvatarUploader.vue";
import PlayerCard from "@/components/PlayerCard.vue";
import { useRuntimeStore } from "@/stores/runtime";


let scaleIndex = ref(3);
const scales = [0.3, 0.7, 1.0, 1.3, 1.7];
const settingVisible = ref(false);
const playerStore = usePlayerStore();
const settingStore = useSettingStore();
const runtimeStore = useRuntimeStore();
// 用来保存 PlayerCard 的引用
const playerCardRefs = ref<any[]>([]);
const bgAudio = ref<HTMLAudioElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const mainRef = ref<HTMLElement | null>(null);

const mainScale = computed(() => {
    return scales[scaleIndex.value];
})

const onClickScale = (step: number) => {
    scaleIndex.value += step;
    scaleIndex.value = Math.min(scales.length - 1, scaleIndex.value);
    scaleIndex.value = Math.max(0, scaleIndex.value);
}


const onClickSetting = () => {
    settingVisible.value = true;
    onClickReset();
}

const onClickAddPlayer = () => {
    playerStore.players.push({
        username: '',
        img: ''
    });
}

const onClickStart = () => {
    runtimeStore.initSelectSetFromArray(playerStore.players)
    playerCardRefs.value.forEach((cardRef, index) => {
        cardRef?.startShuffle?.();
    });
    runtimeStore.shuffling = true;
    // 开始闪烁
    mainRef.value?.classList.add("flashing");
    playSound("/sounds/bg.mp3", true)
}

const onClickStop = (sound: boolean = true) => {
    stopSound()
    if (sound) {
        playSound("/sounds/dong.wav")
    }
    playerCardRefs.value.forEach((cardRef, index) => {
        cardRef?.stopShuffle?.();
    });
    runtimeStore.shuffling = false;
    // 停止闪烁
    mainRef.value?.classList.remove("flashing");
    // 弹性变大动画绑定在 draw__content
    if (contentRef.value) {
        contentRef.value.classList.remove("elastic"); // 重置 class
        void contentRef.value.offsetWidth; // 强制重绘
        contentRef.value.classList.add("elastic");

        setTimeout(() => {
            contentRef.value?.classList.remove("elastic");
        }, 500);
    }
}

const onClickReset = () => {
    if (runtimeStore.shuffling) {
        onClickStop(false);
    }
    playerCardRefs.value.forEach((cardRef, index) => {
        cardRef?.reset?.();
    });
}

const onClickRemove = (idx: number) => {
    playerStore.players = playerStore.players.filter((_, i) => i !== idx);
}

const playSound = (url: string, loop = false) => {
    stopSound(); // 确保不会重复播放
    const audio = new Audio(url);
    audio.loop = loop;
    audio.play();
    bgAudio.value = audio;
};

const stopSound = () => {
    if (bgAudio.value) {
        bgAudio.value.pause();
        bgAudio.value.currentTime = 0;
        bgAudio.value = null;
    }
};


</script>

<style scoped lang="scss">
.draw__cntr {
    width: 100%;
    height: 100%;
    background-color: white;
    color: #000;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}

.draw__ctrl {
    flex-shrink: 0;
}

.draw__main {
    margin-top: 10px;
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #efefef;
    background-image: radial-gradient(#ccc 1px, transparent 1px);
    background-size: 20px 20px;
    overflow: hidden;
    /* 点之间的间距 */
}

.draw__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    // border: 1px solid #eeeeee;
    // border-radius: 8px;
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    // padding: 20px;
    // animation: zoom 0.5s ease-in infinite;
    // background-color: white;
}

@keyframes zoom {
    0% {
        scale: 1.0;
    }

    50% {
        scale: 1.5;
    }

    100% {
        scale: 1.0;
    }
}

.single {
    height: 100%;
    // background-color: rgb(255, 255, 255);
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes elastic-pop {
    0% {
        transform: scale(calc(var(--main-scale) * 1));
    }

    30% {
        transform: scale(calc(var(--main-scale) * 1.1));
    }

    60% {
        transform: scale(calc(var(--main-scale) * 0.97));
    }

    100% {
        transform: scale(calc(var(--main-scale) * 1));
    }
}

.draw__content.elastic {
    animation: elastic-pop 0.5s ease-out;
}

@keyframes flash-bg {
    0% {
        background-color: #efefef;
    }

    50% {
        background-color: #000000; // 柔和的黄色
    }

    100% {
        background-color: #efefef;
    }
}

.draw__main.flashing {
    animation: flash-bg 0.3s infinite;
}

.m-item__cntr {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-weight: bold;
    font-size: 20px;
    width: 140px;
    overflow: hidden;
    padding-bottom: 10px;

    .m-item__header {
        line-height: 30px;
        height: 30px;
        width: 100%;
        background-color: rgb(2, 175, 5);
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 10px;
        color: white;
    }
}



.draw__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .draw__ctrl {
        flex-grow: 1;
    }
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background: linear-gradient(to bottom, #7fc8ff, #49e8be);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    margin: 5px;
}

.group {
    flex-grow: 1;
    // background-color: white;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
}

.group__vs-icon {
    width: 100%;
    height: 50px;
    font-weight: bolder;
    text-align: center;
    line-height: 50px;
    color: #f04123;
    font-size: 35px;
    user-select: none;
    -webkit-user-select: none;
}

.group>*:not(:last-child) {
    margin-right: 10px;
}



.group__cntr {
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    background-color: white;
    padding: 10px;
}

.group__cntr>*:not(:last-child) {
    margin-bottom: 10px;
}

.player-info-item {
    width: 100%;
}

.player-info {
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    overflow: hidden;
    padding: 10px;
    margin-bottom: 10px;
    margin-right: 5px;
}

:deep(.el-form-item__content) {
    width: 100%;
}
</style>