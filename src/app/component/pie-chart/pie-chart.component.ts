import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { Employee } from 'src/app/employee';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnChanges {
  @Input() data: Employee[] = [];

  pieChartLabels: string[] = [];
  pieChartData: ChartDataset[] = [];
  piechartLegend = true;

  constructor() {}

  ngOnChanges(): void {
    if (this.data) {
      //racuna ukupan broj sati | acc-accumulator; curr-current;
      const totalHours = this.data.reduce(
        (acc, curr) => acc + curr.TotalHours,
        0
      );
      //izracunava procenat i zaokruzuje na ceo broj
      const percentages = this.data.map((item) =>
        Math.round((item.TotalHours / totalHours) * 100)
      );

      //postavlja podatke koji ce se prikazivati u odgovarajucem formatu
      this.pieChartData = [
        {
          data: percentages,
          label: 'Percentage[%]',
        },
      ];
      //postavlja imena zaposlenih
      this.pieChartLabels = this.data.map((item) => item.EmployeeName);
    }
  }
}
