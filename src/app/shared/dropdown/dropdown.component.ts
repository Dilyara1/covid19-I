import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() bindLabel: any;
  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter<any>();
  @Input() class: string;
  @Input() arrowClass: string;
  @Input() type: string;
  @Input() placeholder: string;
  @Input() items: any[];
  @Input() searchEnabled: boolean;
  @Input() view = 'mobile';
  @Input() name = '';
  @Input() disabled = false;
  @Input() readOnly = true;
  @Input() title = '';
  @Input() loading: boolean;
  @Input() isOpen?: boolean;
  @Output() open = new EventEmitter();
  filteredItems: any[];
  isCollapsed: boolean;
  searchValue: string;
  selectedValue: {label: string, value: any, description?: string} = {label: '', value: null};

  constructor() {
    this.isCollapsed = true;
  }

  ngOnInit(): void {
    if (this.ngModel) {
      this.getSelectedValue(this.ngModel);
    }
    this.filteredItems = this.items;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {items, ngModel} = changes;
    if (items && items.currentValue) {
      this.filteredItems = items.currentValue;
    }
    if (ngModel && ngModel.currentValue) {
      if (ngModel.currentValue !== this.selectedValue?.value) {
        this.ngModel = ngModel.currentValue;
        this.getSelectedValue(this.ngModel);
      }
    }
  }

  toggleDropdown(): void {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed && this.isOpen) {
      this.items = [];
      this.open.emit(true);
    }
    this.searchValue = '';
    this.filteredItems = this.items;
  }

  select(item: any): void {
    this.getSelectedValue(item);
    this.selectedValue.value.label = this.selectedValue.label;
    this.ngModelChange.emit(this.selectedValue.value);
    this.toggleDropdown();
  }

  getSelectedValue(item: any): void {
    if (item[this.bindLabel]) {
      this.selectedValue.label = item[this.bindLabel];
    } else {
      this.selectedValue.label = item[this.bindLabel];
    }
    this.selectedValue.description = item?.description;
    this.selectedValue.value = item;
  }

  search(): void {
    if (this.searchValue.length > 2) {
      this.filteredItems = this.items.filter((value) => value[this.bindLabel].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0);
    } else {
      this.filteredItems = this.items;
    }
  }

}
