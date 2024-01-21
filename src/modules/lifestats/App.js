// App.js

/* TODO
- date format
- slice to exclude zero element
*/

import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import WeightChartData from './WeightChartData';
import StatsChartData from './StatsChartData';
import ServiceChartData from './ServiceChartData';

import {CategoryScale} from 'chart.js';
import "./styles.css";

const LifeStats = () => {
  const WeightData = WeightChartData();
  const StatsData = StatsChartData();
  const ServiceData = ServiceChartData();

//  console.log(StatsData)
  return (
    <div>
      <div className="LifeStatsChart">
        <Line data={WeightData} />
      </div>
      <div className="LifeStatsChart">
        <Line data={StatsData} />
      </div>
      <div className="LifeStatsChart">
        <Line data={ServiceData} />
      </div>
    </div>
  );
};

export default LifeStats;