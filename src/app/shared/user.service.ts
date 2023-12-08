import { Injectable } from "@angular/core";

@Injectable()
export class UserService {
    private isAdmin = false;
    
    toggleAdmin(): void{
        this.isAdmin = !this.isAdmin;
    }

    adminStatus(): boolean{
        return this.isAdmin;
    }

}