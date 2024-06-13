import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
@Directive({
  selector: '[onlyDecimalNumber]'
})
export class OnlyDecimalNumber {
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement;
    let inputValue: string = inputElement.value;
    // Remove non-numeric characters and keep only digits and one dot
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    // Ensure there's only one dot
    const dotCount = inputValue.split('.').length - 1;
    if (dotCount > 1) {inputValue = inputValue.slice(0, inputValue.lastIndexOf('.'));}
    // Allow only two digits after the dot
    const dotIndex = inputValue.indexOf('.');
    if (dotIndex !== -1) {inputValue = inputValue.slice(0, dotIndex + 3);}// Update the input value
    this.renderer.setProperty(inputElement, 'value', inputValue);
  }

  @HostListener('blur') onBlur(): void {
    const inputElement = this.el.nativeElement;
    let inputValue: string = inputElement.value;
    // Ensure there's at least one digit before the dot
    if (!/^\d+\./.test(inputValue)) {
      inputValue=parseFloat(inputValue).toFixed(2); 
      if(inputValue.trim()=="NaN"){ inputValue=''};
    }
    inputValue = inputValue.replace(/\.(\d{0,2})\d*$/, '.$1'); /** @Ensure there are two digits after the dot*/
    
    this.renderer.setProperty(inputElement, 'value', inputValue);// Update the input value
  }
}