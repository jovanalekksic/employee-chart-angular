import { Component, OnInit } from '@angular/core';

import { EmployeeServiceService } from 'src/app/services/employee-service.service';
import { Employee } from 'src/app/employee';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  employees: any[] = [];

  constructor(private employeeService: EmployeeServiceService) {}

  ngOnInit(): void {
    this.employeeService.getData().subscribe((data) => {
      //Map, da bi sacuvali ukupne sate za svakog zaposlenog
      const employeeMap = new Map<string, number>();

      data.forEach((employee) => {
        const currentTotal = this.getTotalHours(employee); //racuna trenutne sate
        const totalHours = employeeMap.get(employee.EmployeeName) || 0; //vraca postojece sate iz mape
        employeeMap.set(employee.EmployeeName, totalHours + currentTotal); //postavlja nove sate na key: EmployeeName
      });

      //pretvaramo mapu u niz, da bi tabela mogla da koristi
      this.employees = Array.from(
        employeeMap,
        ([EmployeeName, TotalHours]) => ({ EmployeeName, TotalHours })
      );
      this.employees.sort((a, b) => b.TotalHours - a.TotalHours);
    });
  }

  getTotalHours(employee: Employee): number {
    const startTime = new Date(employee.StarTimeUtc);
    const endTime = new Date(employee.EndTimeUtc);
    //postoje pogresno uneti podaci za vreme
    if (startTime > endTime) {
      return 0;
    }
    const totalMilliseconds = Math.abs(endTime.getTime() - startTime.getTime());
    //milisekunde u sate, zaokruzeno
    return Math.round(totalMilliseconds / (1000 * 60 * 60));
  }
}
