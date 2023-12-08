import { Component } from '@angular/core';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent {
  products: any[] = [];

  constructor() {
    // Retrieve form data from local storage
    for (let i = 0; i <= localStorage.length; i++) {
      const formDataJSON = localStorage.getItem(`formData${i}`);
      if (formDataJSON) {
        const formData = JSON.parse(formDataJSON);
        const name = formData[`name${i}`];
        const imageUrl = formData[`url${i}`];
        this.products.push({
          name,
          imageUrl,
        });
      }
    }
  }
}
