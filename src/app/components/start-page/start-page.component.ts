import { Component } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})

export class StartPageComponent {

  constructor(private userService: UserService){}
  
  adminToggle(): void {
    this.userService.toggleAdmin();
  }

}
