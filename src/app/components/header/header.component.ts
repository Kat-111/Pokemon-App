import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { RestPokemons } from 'src/app/shared/rest-pokemons.service';
import { PokemonItem } from 'src/app/models/pokemon-item.model';
import { ProductsListGuard } from '../products-list/products-list-guard.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchTerm: string;
  private allPokemon : PokemonItem[] = [];

  private allPokemons: Subscription;
  
  constructor(
    private userService: UserService, 
    private pokeRestService: RestPokemons, 
    private router: Router,
    private myGuard: ProductsListGuard
  ){}

  ngOnInit(): void {
    this.allPokemons = this.pokeRestService.getAllPokemon().subscribe((pokemonList) => {
      this.allPokemon = pokemonList;
    });
  }

  isAdmin(): boolean{
    return this.userService.adminStatus();
  }

  isLinkActive(): boolean {
    return this.myGuard.canActivate() as boolean;
  }

  onSearch(): void{
    if (this.searchTerm && this.searchTerm.length > 3) {
      const filteredPokemon = this.allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
      if(filteredPokemon.length){
        const searchedPokeId = filteredPokemon[0].url.split('/')[6];
        this.router.navigate(['/pokemon-detail/'+searchedPokeId]);
        this.searchTerm = '';
      }
    }
  }
}
