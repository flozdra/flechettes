<script lang="ts" setup>
interface Props {
  table: CricketTable;
}
defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-7 rounded-lg text-lg font-bold">
    <span>20</span>
    <span>19</span>
    <span>18</span>
    <span>17</span>
    <span>16</span>
    <span>15</span>
    <span>Bull</span>
    <CricketScoreIcon :score="table[20]" />
    <CricketScoreIcon :score="table[19]" />
    <CricketScoreIcon :score="table[18]" />
    <CricketScoreIcon :score="table[17]" />
    <CricketScoreIcon :score="table[16]" />
    <CricketScoreIcon :score="table[15]" />
    <CricketScoreIcon :score="table.bull" />
  </div>
</template>
