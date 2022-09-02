import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() items: any[] = [];
  @Output() modelValueChange = new EventEmitter<any>();
  myControl = new FormControl('');
  options: any[] = [];
  filteredOptions: Observable<any[]>;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const { items } = changes;
    if (items && items.currentValue) {
      this.options = [...this.items];
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          return this._filter(value || '')
        }));
    }
  }

  selectValue(event: any) {
    this.modelValueChange.emit(event.option.value);
  }

  checkValue(inputValue: any) {
    if (!inputValue) {
      this.modelValueChange.emit('');
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
