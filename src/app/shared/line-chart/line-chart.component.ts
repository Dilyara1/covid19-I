import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartType } from "chart.js";
import { Color, Label } from "ng2-charts";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() chartData: any;
  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType ='line';

  constructor() {
  }

  ngOnInit() {
    this.initChartData(this.chartData);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { chartData } = changes;
    if (chartData && chartData.currentValue) {
     this.initChartData(chartData.currentValue);
    }
  }

  initChartData(chartData: any) {
    if (chartData) {
      this.chartData = chartData;
      this.lineChartData = this.chartData.data;
      this.lineChartLabels = this.chartData.regionLabels;
    }
  }
}
