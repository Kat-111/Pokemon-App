import { Component, OnInit } from '@angular/core';
import { Subscription, catchError } from 'rxjs';
import { RestPokemons } from 'src/app/shared/rest-pokemons.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PokemonList } from 'src/app/models/pokemon-list.model';
import { PokemonItem } from 'src/app/models/pokemon-item.model';
import * as myGlobals from '../../shared/globals';
import { LoadingService } from 'src/app/shared/loading.service';

@UntilDestroy()
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  isLoading: boolean = false;
  pokeList: PokemonItem[] = [];
  alt = "https://media.wired.com/photos/5f87340d114b38fa1f8339f9/master/w_1600%2Cc_limit/Ideas_Surprised_Pikachu_HD.jpg";

  private totalPokemons: Subscription;
  private loading: Subscription;
  private batchOfPokemons: Subscription;
  private next: Subscription;
  private previous: Subscription;
  private count: number;
  private imgUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  constructor(private pokeRestService: RestPokemons, private loadingService: LoadingService){}

  ngOnInit(): void{
    this.loading = this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    
    this.batchOfPokemons = this.pokeRestService.loadPokemonsPerPage().pipe(catchError((err) => {
      throw err.message;
    })).subscribe((data: PokemonList) => {
      this.pokeList = data.results;
    });

    this.totalPokemons = this.pokeRestService.getTotalPokemonCount().subscribe((count) => {
      this.count = count;
    });
  }

  getPokemonId(id: number): number{
    let offset = (myGlobals.page - 1) * 30;
    let pathId = id+offset;
    return pathId;
  }

  getPokemonImage(id: number): string{
    let offset = (myGlobals.page - 1) * 30;
    let url = `${this.imgUrl}${id+offset}.png`;
    return url;
  }

  // NEXT/ PREVIOUS BUTTONS
  onPrevious(): void{
    myGlobals.setPage(myGlobals.page - 1);
    if(this.previous){
      this.previous.unsubscribe();
    }
    this.previous = this.pokeRestService.loadPokemonsPerPage().subscribe((data: PokemonList) => {
      this.pokeList = data.results;
    });
  }

  onNext(): void{
    myGlobals.setPage(myGlobals.page + 1);
    if(this.next){
      this.next.unsubscribe();
    }
    this.next = this.pokeRestService.loadPokemonsPerPage().subscribe((data: PokemonList) => {
      this.pokeList = data.results;
    });
  }

  isPreviousButtonActive(): boolean{
    let offset = (myGlobals.page - 1) * 30;
    return !!offset;
  }

  isNextButtonActive(): boolean{
    let limit = this.count / 30;
    if(myGlobals.page <= limit){
      return true;
    }
    else{
      return false;
    }
  }
}


