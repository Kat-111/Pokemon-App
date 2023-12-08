import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PokemonList } from "../models/pokemon-list.model";
import { Observable, forkJoin, map, mergeMap, of } from "rxjs";
import { PokemonItem } from "../models/pokemon-item.model";
import * as myGlobals from '../shared/globals';

@Injectable()
export class RestPokemons{
    private limit = 30; // Number of Pokemons per batch
    private baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
    private detailsUrl = `https://pokeapi.co/api/v2/pokemon/`;
    private detailsSpeciesUrl= `https://pokeapi.co/api/v2/pokemon-species/`;
    private damageUrl = `https://pokeapi.co/api/v2/move/`;

    constructor(private http: HttpClient) {}
    
    getTotalPokemonCount(): Observable<number> {
      return this.http.get<PokemonList>(this.detailsSpeciesUrl).pipe(
        map((data: any) => data.count)
      );
    }
    
    getAllPokemon(): Observable<PokemonItem[]> {
      return this.getTotalPokemonCount().pipe(
        mergeMap(totalCount => {
          const requests = [];
  
          for (let offset = 0; offset < totalCount; offset += this.limit) {
            const url = `${this.baseUrl}?limit=${this.limit}&offset=${offset}`;
            requests.push(this.http.get<PokemonList>(url));
          }
          return this.mergeRequests(requests);
        })
      );
    }
    
    loadPokemonsPerPage(): Observable<PokemonList> {
        let offset = (myGlobals.page - 1) * 30;
        return this.http.get<PokemonList>(this.getListUrl(offset));
    }
   
    getPokemonDetails(id: number): Observable<PokemonItem> {
        const url = `${this.detailsUrl}${id}/`;
        return this.http.get<PokemonItem>(url);
    }

    getPokemonDetailsSpecies(id: number): Observable<PokemonItem> {
        let url = `${this.detailsSpeciesUrl}${id}/`;
        return this.http.get<PokemonItem>(url);
    }

    getPokemonDetailsEvolution(url: string): Observable<PokemonItem> {
        return this.http.get<PokemonItem>(url);
    }

    getDamageWhenAttacked(id: number): Observable<PokemonItem> {
        let url = `${this.damageUrl}${id}/`;
        return this.http.get<PokemonItem>(url);
    }

  private getListUrl(offset: number): string{
    return `https://pokeapi.co/api/v2/pokemon/?limit=30&offset=${offset}`;
  }

  private mergeRequests(requests: Observable<PokemonList>[]): Observable<PokemonItem[]> {
    if (requests.length > 0) {
      return forkJoin(requests).pipe(
        map((results: any[]) => results.reduce((acc, result) => acc.concat(result.results), []))
      );
    } else {
      return of([]); 
    }
  }
}