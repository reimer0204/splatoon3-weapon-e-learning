<template>
    <div class="app">
        <h1>スプラ3 サブスペ暗記ツール</h1>

        <div class="top-page" v-if="state == 0">
            <p>
                ブキのサブスペクイズです。<br>
                中断も出来るのでやりたい時にやりたい分だけ勉強できます。<br>
                <br>
                まだ作者のランクが低いのでほぼ全てのブキアイコンにランクのマークがついてますが許してください。
            </p>

            <button @click="start(false)">全ブキではじめる</button>
        </div>

        <div class="question-page" v-if="state == 1">
            <p>
                <h2>{{ questionIndex + 1 }}/{{ questionList.length }}問目</h2>
                <div class="weapon_icon"><img :src="`weapon/${question.id}.jpg`" /></div>
                <div class="weapon_name">{{ question.name }}</div>
            </p>

            <p class="sub-list choice-list">
                <div v-for="sub in subList" class="sub choice" :class="{ 'active': answer.subId == sub.id, 'right': !answer.correct && question.subId == sub.id }" @click="answer.subId = sub.id">
                    <img :src="`sub/${sub.id}.jpg`" />
                    <div class="name">{{ sub.name }}</div>
                </div>
            </p>

            <p class="special-list choice-list">
                <div v-for="special in specialList" class="sub choice" :class="{ 'active': answer.specialId == special.id, 'right': !answer.correct && question.specialId == special.id }" @click="answer.specialId = special.id">
                    <img :src="`special/${special.id}.jpg`"/>
                    <div class="name">{{ special.name }}</div>
                </div>
            </p>

            <p class="correct-message" v-if="!answer.correct">
                不正解！正しいものを選択して再度回答してください
            </p>

            <div class="button-list">
                <button @click="finish(true)">終了</button>
                <button @click="next" :disabled="answer.subId == null || answer.specialId == null">回答</button>
            </div>
        </div>

        <div class="result-page" v-if="state == 2">

            <p>
                <h2>お疲れさまでした</h2>
                正解率: {{ (correctRate * 100).toFixed(1) }}% ({{ correctNum }}/{{ questionIndex }})
            </p>

            <button @click="state = 0">やめる</button>
            <button @click="start(true)" :disabled="correctNum == questionIndex">間違えた問題を復習</button>
        </div>
    </div>
</template>

<script>

import DataList from './list.js'

export default {
    data() {
        return {
            state: 0,
            subList: DataList.subs,
            specialList: DataList.specials,
            weaponList: DataList.weapons,
            resultList: [],

            questionList: [],
            questionIndex: 0,

            answer: {
                subId: null,
                specialId: null,
                correct: null,
            },
        };
    },
    computed: {
        question() {
            return this.questionList[this.questionIndex];
        },
        correctNum() {
            return this.resultList.filter(result => result.answer.correct).length;
        },
        correctRate() {
            return this.questionIndex ? this.correctNum / this.questionIndex : 0;
        },
    },
    methods: {
        // 問題開始時の初期化
        start(retry = false) {
            this.state = 1;

            // リトライなら間違った問題から、そうでなければ全ブキから
            if(retry) {
                this.questionList = this.resultList.filter(result => !result.answer.correct).map(result => result.question);
            } else {
                this.questionList = [...DataList.weapons];
            }
            this.questionIndex = 0;

            this.resultList = [];
            this.shuffleQuestionList();
            this.clearAnswer();
        },
        clearAnswer() {
            this.answer = {
                subId: null,
                specialId: null,
                correct: true,
            };
        },
        next() {
            // どちらか間違っていたら不正解表示、正解を選ぶまで進ませない
            if(this.question.subId != this.answer.subId || this.question.specialId != this.answer.specialId) {
                this.answer.correct = false;
                return;
            }

            // 正解なら次のブキアイコンを見せたいのでスクロール位置を最初に戻す
            window.scrollTo(0, 0);

            this.resultList.push({ answer: this.answer, question: this.question });
            this.clearAnswer();

            this.questionIndex++;
            if(this.questionIndex >= this.questionList.length) {
                this.finish();
            }
        },
        finish() {
            this.state = 2;
        },
        shuffleQuestionList() {
            for (let i = this.questionList.length - 1; i >= 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.questionList[i], this.questionList[j]] = [this.questionList[j], this.questionList[i]];
            }
        }
    },
}

</script>

<style lang="scss" scoped>
.app {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 1em;
}

h1 {
    text-align: center;
    font-weight: bold;
    font-size: 150%;
    padding: 0.5em;
    background-color: rgb(240, 167, 11);
    color: #FFF;
}

p {
    margin: 1em 1em;
    padding: 2em;
    background-color: #FFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    text-align: center;

    h2 {
        font-size: 120%;
        text-align: center;
        font-weight: bold;
    }
}

button {
    padding: 1em 2em;
    border-radius: 5px;

    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    background-color: rgb(40, 7, 187);
    color: #FFF;

    &:disabled {
        background-color: #AAA;
    }
}

.top-page {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
        margin-bottom: 3em;
        text-align: center;
    }
}

.question-page {

    h2 {
        font-size: 150%;
        margin-bottom: 1em;
    }

    .weapon_name {
        text-align: center;
        font-size: 150%;
        font-weight: bold;
    }

    .weapon_icon {
        text-align: center;
        img {
            width: 100px;
            height: 100px;
            border-radius: 30px;
        }
    }

    .choice-list {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 10px;
        padding: 1em;

        text-align: center;
        
        .choice {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            border: 3px #EEE solid;
            border-radius: 5px;
            padding: 3px;
            width: 72px;
            min-height: 95px;

            img {
                width: 50px;
                height: 50px;
                border-radius: 10px;
            }

            .name {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1 1 0;
                font-size: 10px;
            }

            &.active {
                border-color: blue;
            }

            &.right {
                background-color: rgba(255, 0, 0, 0.2);
            }
        }
    }

    .correct-message {
        padding: 1em 2px;
        background-color: rgb(255, 240, 217);
        border: 1px rgb(247, 224, 203) solid;
        border-radius: 5px;
    }

    .button-list {
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        button {
            width: 40%;
        }
    }
}

.result-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    button {
        margin: 1em;
    }
}


hr {
	display: block;
	border: none;
	border-bottom: 1px #000 solid;
}
</style>