import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from "ng2-charts";
import { ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() chartData: any;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  public pieChartLabels: Label[] = ['PHP', '.Net', 'Java'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
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
      this.pieChartData = this.chartData.data;
      this.pieChartLabels = this.chartData.labels;
    }
  }
}
