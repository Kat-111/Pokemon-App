import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription, catchError, forkJoin } from 'rxjs';
import { PokemonItem } from 'src/app/models/pokemon-item.model';
import { ColorThemes } from 'src/app/shared/color-types';
import { LoadingService } from 'src/app/shared/loading.service';
import { RestPokemons } from 'src/app/shared/rest-pokemons.service';

@UntilDestroy()
@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit{
  isLoading: boolean = false;
  pokeItem: PokemonItem = new PokemonItem();
  pokeProfile: PokemonItem = new PokemonItem();
  pokeEvolvedData: PokemonItem = new PokemonItem();
  pokeStats: any[];
  pokeDescription: string;
  pokeAbilities: any[];
  pokeEggs: any[];
  hatchSteps: number;
  maleChances: number;
  femaleChances: number;
  pokeEvolvedName: string;
  evoLevel: number;
  pokeDamageWhenAttacked: string;

  private pokemon: { id: number } | undefined;
  private pokeEvolution: PokemonItem = new PokemonItem(); 
  private pokeDamage: PokemonItem = new PokemonItem();
  private evolutionEmitter = new EventEmitter<string>();
  private evolutionImageEmitter = new EventEmitter<string>();
  private completeData: Subscription;
  private pokeEvolutionSub: Subscription;
  private pokeEvolutionImgSub: Subscription;
  private routeSubscription: Subscription;
  private evolutionDataEmitter: Subscription;
  private evolutionImgEmitter: Subscription;
  private loading: Subscription;
  private typeColor: any;
  private evolutionChainUrl: string = '';
  private pokeEvolvedImgUrl: string;
  private damageColors: any = {
    status: 'orange',
    physical: 'blue',
    special: 'red'
  }

  constructor( 
    private route: ActivatedRoute, 
    private pokeRestService: RestPokemons, 
    private colorThemes: ColorThemes,
    private loadingService: LoadingService
  ){}

  ngOnInit(): void{
    this.routeSubscription = this.route.params.subscribe(() => {
      this.onPokemonChange();
    });
  }

  // On pokemon ID change
  onPokemonChange(): void{
    this.pokemon = {
      id: this.route.snapshot.params['id']
    }

    this.loading = this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });

    this.completeData = forkJoin({
      requestStatsData: this.pokeRestService.getPokemonDetails(+this.pokemon.id),
      requestProfileData: this.pokeRestService.getPokemonDetailsSpecies(+this.pokemon.id),
      requestDamageData: this.pokeRestService.getDamageWhenAttacked(+this.pokemon.id),
    }).subscribe(({ requestStatsData, requestProfileData, requestDamageData}) => {
      // Pokemon Stats
      this.getStatsData(requestStatsData);
      // Pokemon Profile
      this.getProfileData(requestProfileData);
      // Pokemon Damage
      this.getDamageData(requestDamageData);
     });

    // EVOLUTION DATA
    this.evolutionDataEmitter = this.evolutionEmitter.subscribe((evoUrl) => {
      if(!!this.pokeEvolutionSub){
        this.pokeEvolutionSub.unsubscribe();
      }
      this.pokeEvolutionSub = this.pokeRestService.getPokemonDetailsEvolution(evoUrl).pipe(catchError((err) => {
        throw err.message;
      })).subscribe((data) => {
        this.getEvolutionData(data);
      });
    });

    // EVOLUTION IMAGE DATA
    this.evolutionImgEmitter = this.evolutionImageEmitter.subscribe((evoImgUrl) => {
      if(!!this.pokeEvolutionImgSub){
        this.pokeEvolutionImgSub.unsubscribe();
      }
      this.pokeEvolutionImgSub = this.pokeRestService.getPokemonDetailsEvolution(evoImgUrl).pipe(catchError((err) => {
        throw err.message;
      })).subscribe((data) => {
        this.pokeEvolvedData = Object.assign(this.pokeEvolvedData, data);
      });
    })
  }

  // SUBSCRIBE DATA FUNCTIONS
  getStatsData(data: PokemonItem): void{
    this.pokeItem = Object.assign(this.pokeItem, data);
    this.typeColor = this.colorThemes;
    this.pokeStats = this.pokeItem.stats;
    this.pokeAbilities = this.pokeItem.abilities;
  };

  getProfileData(data: PokemonItem): void{
    this.pokeProfile = Object.assign(this.pokeProfile, data);
    this.pokeEggs = this.pokeProfile.egg_groups;
    this.pokeDescription = this.pokeProfile.description;
    this.evolutionChainUrl = this.pokeProfile.evolution_chain.url;
    this.hatchSteps = (this.pokeProfile.hatch_counter+1)*255;
    this.femaleChances = (this.pokeProfile.gender_rate/8)*100;
    this.maleChances = 100 - this.femaleChances;
    this.evolutionEmitter.emit(this.evolutionChainUrl);
  }

  getDamageData(data: PokemonItem): void{
    this.pokeDamage = Object.assign(this.pokeDamage, data);
    this.pokeDamageWhenAttacked = this.pokeDamage.damage_class.name;
  }

  getEvolutionData(data: PokemonItem): void{
    const isBabyPoke: boolean = this.pokeProfile.evolves_from_species == undefined;

    this.pokeEvolution = Object.assign(this.pokeEvolution, data);
    this.pokeEvolvedName = this.pokeEvolution.evolution(isBabyPoke);
    this.pokeEvolvedImgUrl = this.pokeEvolution.evoUrlToImage(isBabyPoke).replace("-species", "");
    this.evoLevel = this.pokeEvolution.evolutionLevel(isBabyPoke);
    this.evolutionImageEmitter.emit(this.pokeEvolvedImgUrl);
  }

  // COLOURS
  getTypeColor(pokeType: string): string {
    const allPossibleTypes = Object.keys(this.typeColor.COLOR_THEMES);
    if(allPossibleTypes.includes(pokeType)){
      return this.typeColor.COLOR_THEMES[pokeType];
    }
    return '';
  }

  getDamageColor(damageType: string): string {
    const allPossibleDamage = Object.keys(this.damageColors);
    if(allPossibleDamage.includes(damageType)){
      return this.damageColors[damageType];
    }
    return '';
  }
}
