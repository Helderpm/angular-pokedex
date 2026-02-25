import { DatePipe } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { PokemonBorderDirective } from '../../pokemon-border.directive';
import { PokemonService } from '../../pokemon.service';
import { Pokemon, PokemonList } from '../../pokemon.model';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pokemon-list',
       imports: [DatePipe, RouterLink, PokemonBorderDirective],
       templateUrl: './pokemon-list.component.html',
       styles: [
           `
         .pokemon-card {
           cursor: pointer;
         }
       `,
  ],
})

export class PokemonListComponent {
  readonly pokemonService = inject(PokemonService);
  readonly pokemonListResource = this.pokemonService.getPokemonList();
  readonly pokemonList = computed(() => this.pokemonListResource.value() || []);
  readonly searchTerm = signal('');
  readonly resetting = signal(false);

  readonly loading = computed(() => {
    return this.pokemonList().length === 0 && !this.resetting();
  });

  readonly pokemonListFiltered = computed(() => {
    return this.pokemonList().filter((pokemon: Pokemon) =>
      pokemon.name
        .toLowerCase()
        .includes(this.searchTerm().trim().toLowerCase()),
    )
    .filter((pokemon: Pokemon) => {
           const typeSelected = this.typeSelected();
           if (!typeSelected) {
             return true;
           }
           return pokemon.types.includes(typeSelected);
         })
  });

  readonly typeList = computed(() => {
    const allTypes = this.pokemonList().flatMap((pokemon: Pokemon) => pokemon.types);
    return [...new Set(allTypes)];
  });

  readonly typeSelected = signal<string | null>(null);

  size(pokemon: Pokemon): string {
    if (pokemon.life <= 15) {
      return 'Petit';
    }
    if (pokemon.life >= 25) {
      return 'Grand';
    }

    return 'Moyen';
  }

  filterByType(type: string): void {
    const newType = this.typeSelected() === type ? null : type;
    this.typeSelected.set(newType);
  }

  removePokemon(pokemon: Pokemon): void {
    this.pokemonService.deletePokemon(pokemon.id).subscribe(() => {
      // Refresh the list after deletion
      // Note: HttpResourceRef doesn't have subscribe method, this might need adjustment
    });
  }
  resetPokemonList(): void {
    this.resetting.set(true);
    this.pokemonService.resetPokemonList().subscribe(() => {
      this.resetting.set(false);
      window.location.reload();
    });
  }
}
