import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-pokemon',
  templateUrl: './new-pokemon.component.html',
  styleUrls: ['./new-pokemon.component.css']
})
export class NewPokemonComponent {
  dynamicForms: FormGroup[] = [];
  private formControlCounter = 0;
  private highestIndex = this.findHighestIndexInLocalStorage();
  //validations
  private LETTERS_NUMBERS: string = '^[a-zA-Z0-9 ]*$';
  private NUMBERS: string = '^[0-9]*$';
  private NUMBERS_2_DECIMALS: RegExp = /^\d+\.\d{2}$/;
  private IMAGE_URL: RegExp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.(jpg|jpeg|gif|png|svg|bmp)(\?[^\s]*)?$/;
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const initialForm = this.createForm();
    this.dynamicForms.push(initialForm);
  }

  findHighestIndexInLocalStorage(): number {
    let highestIndex = -1;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('formData')) {
        const index = parseInt(key.substring(8), 10); //getting formData ending in index
        if (!isNaN(index) && index > highestIndex) {
          highestIndex = index;
        }
      }
    }
    return highestIndex;
  }
  
  createForm(): FormGroup<any> {
    const uniqueName = `name${this.formControlCounter}`;
    const uniqueDescription = `description${this.formControlCounter}`;
    const uniquePrice = `price${this.formControlCounter}`;
    const uniqueCategory = `category${this.formControlCounter}`;
    const uniqueURL = `url${this.formControlCounter}`;
    const uniquePhone = `phone${this.formControlCounter}`;
    const uniquePhoneType = `phone-type${this.formControlCounter}`;

    this.formControlCounter++;

    return this.fb.group({
      [uniqueName]: [null, [Validators.required, Validators.minLength(3), Validators.pattern(this.LETTERS_NUMBERS)]],
      [uniqueDescription]: [null, [Validators.required, Validators.minLength(3), Validators.pattern(this.LETTERS_NUMBERS)]],
      [uniquePrice]: [null, [Validators.required, Validators.pattern(this.NUMBERS_2_DECIMALS)]],
      [uniqueCategory]: [null, Validators.required],
      [uniqueURL]: ['', [Validators.required, Validators.pattern(this.IMAGE_URL)]],
      [uniquePhone]: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(this.NUMBERS)]],
      [uniquePhoneType]: [null, Validators.required],
    });
  }

  addForm(): void{
    if(this.formControlCounter < 5){
      const newForm = this.createForm();
      this.dynamicForms.push(newForm);
    }
    else{
      alert('You reached MAX amount of forms!');
    }
  }

  onSaveForm(form: FormGroup): void {
    const newIndex = this.highestIndex + 1;
    if(form && form.valid){
      const formData = form.value;
      const formDataJSON = JSON.stringify(formData);

      // Store the form data in local storage with a unique key
      localStorage.setItem(`formData${newIndex}`, formDataJSON);
      // Reset the form
      form.reset();
      this.highestIndex++;
    }
    else{
      alert('Form invalid')
    }
  }

  onReset(form: FormGroup): void {
    form.reset();
  }
  
}


