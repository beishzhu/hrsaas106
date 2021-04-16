<template>
  <div>
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <el-select @change="dateChange" v-model="currentYear" size="small" style="width:120px">
        <el-option v-for="item in yearList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <!-- 月 -->
      <el-select @change="dateChange" v-model="currentMonth" size="small" style="width:120px">
        <el-option v-for="item in 12" :key="item" :value="item" :label="item"></el-option>
      </el-select>
    </el-row>
    <!-- 日历 -->
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{date,data}">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay}}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date
    }
  },
  data() {
    return {
      yearList: [],
      currentYear: null,// 当前的年
      currentMonth: null, // 当前的月
      currentDate: null // 当前日
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (v, i) => i + 2020 - 5)
    this.dateChange()
  },
  methods: {
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    },
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  },
}
</script>

<style  scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>

