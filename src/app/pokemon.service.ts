import { HttpResourceRef } from '@angular/common/http';
import { Signal } from '@angular/core';
import { Pokemon, PokemonList } from './pokemon.model';
import { Observable } from 'rxjs';

export abstract class PokemonService {
  abstract getPokemonList(): HttpResourceRef<PokemonList>;
  abstract getPokemonById(id: Signal<number>): HttpResourceRef<Pokemon | undefined>;
  abstract updatePokemon(pokemon: Pokemon): Observable<Pokemon>;
  abstract deletePokemon(pokemonId: number): Observable<void>;
  abstract addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon>;
  abstract getPokemonTypeList(): string[];
  abstract resetPokemonList(): Observable<void>;
}
