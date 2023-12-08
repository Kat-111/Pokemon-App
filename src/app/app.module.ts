import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonCardComponent } from './components/pokemon-list/pokemon-card/pokemon-card.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { NewPokemonComponent } from './components/new-pokemon/new-pokemon.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from './components/start-page/start-page.component';
import { UserService } from './shared/user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RestPokemons } from './shared/rest-pokemons.service';
import { ColorThemes } from './shared/color-types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsListGuard } from './components/products-list/products-list-guard.component';
import { LoaderInterceptor } from './shared/loading.interceptor';

const appRoutes : Routes = [
  { path: '', component: StartPageComponent, pathMatch: 'full' },
  { path: 'home', component: PokemonListComponent },
  { path: 'pokemon-detail/:id', component: PokemonDetailComponent },
  { path: 'create-new-pokemon', component: NewPokemonComponent },
  { path: 'products-list', component: ProductsListComponent, canActivate: [ProductsListGuard] },
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StartPageComponent,
    PokemonListComponent,
    PokemonCardComponent,
    PokemonDetailComponent,
    NewPokemonComponent,
    ProductsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    UserService,
    RestPokemons,
    ColorThemes,
    ProductsListGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
