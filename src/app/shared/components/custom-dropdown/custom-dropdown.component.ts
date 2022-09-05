import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit, OnChanges {
  public testForm: NgForm;
  public isDropDownOpen: boolean = false;
  @Input() items: any[] = [];
  @Input() disabled = false;
  @Output() inputValueChange = new EventEmitter();
  inputValue = '';
  filteredOptions: any = [];

  constructor() {
  }

  ngOnInit(): void {
    this.filteredOptions = [...this.items];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {items} = changes;
    if (items && items.currentValue) {
      this.filteredOptions = [...items.currentValue];
    }
  }

  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  handleInputEvent(inputValue: string) {
    this.isDropDownOpen = true;
    if (!inputValue) {
      this.isDropDownOpen = false;
      this.inputValueChange.emit('');
      this.filteredOptions = [...this.items];
    } else {
      this.filteredOptions = this.items.filter((value) => value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0);
    }
  }

  selectOption(option: any) {
    this.inputValue = option;
    this.inputValueChange.emit(this.inputValue);
    this.isDropDownOpen = false;
  }
}
