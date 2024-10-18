<template>
  <div class="game-container">
    <div class="header">
      <h1 :class="resultTitle === '成功' ? 'sucess' : 'fail'">{{ resultTitle }}</h1>
      <div class="coins">{{ totalCoins }}</div>
    </div>
    <table class="score-table">
      <thead>
        <tr>
          <th>昵称</th>
          <!-- <th>底分</th>
          <th>倍数</th>-->
          <th>欢乐豆</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.userName">
          <td>{{ player.userName }}</td>
          <!-- <td>{{ player.baseScore }}</td>
          <td>{{ player.multiplier }}</td>-->
          <td>
            {{ player.settleScore }}
            <!-- <span v-if="player.crown" class="crown">封顶</span> -->
          </td>
        </tr>
      </tbody>
    </table>

    <div class="buttons">
      <button class="btn reveal" @click="$emit('exit-room')">退出房间</button>
      <button class="btn continue" @click="$emit('continue-game')">继续游戏</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resultTitle: {
      type: String,
      default: "游戏结束"
    },
    totalCoins: {
      type: String,
      required: true
    },
    players: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.game-container {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 600px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sucess {
  color: #009bff;
  font-size: 48px;
  font-weight: bold;
}
.fail {
  color: red;
  font-size: 48px;
  font-weight: bold;
}

.coins {
  color: #ffcc00;
  font-size: 24px;
}

.coins span {
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

.score-table {
  width: 100%;
  margin-bottom: 20px;
}

.score-table th,
.score-table td {
  padding: 10px;
  text-align: center;
  width: 250px;
}

.score-table th {
  background-color: #f0f8ff;
  color: #333;
  font-size: 16px;
  border-bottom: 2px solid #ddd;
}

.score-table td {
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.crown {
  background-color: #ffcc00;
  padding: 2px 5px;
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
}

.buttons {
  display: flex;
  justify-content: space-around;
}

.btn {
  background-color: #009bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background-color: #007acc;
}

.reveal {
  background-color: #3c8cff;
}

.continue {
  background-color: #fdbb00;
}

.continue:hover {
  background-color: #e89a00;
}
</style>
