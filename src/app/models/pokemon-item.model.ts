export class FlavorText{
    flavor_text: string;
    language: {};
    version: {}
}
export class EvolutionDetails{
    min_level: number
}
export class EvolutionChain{
    evolution_details: EvolutionDetails[];
    evolves_to: [
        EvolutionChain
    ];
    is_baby: boolean;
    species: {
        name: string,
        url: string
    }
}

export class PokemonItem {
    constructor(){}

    abilities: [];
    baseExperience: number;
    capture_rate: number;
    chain: {
        evolves_to: EvolutionChain[],
        species: {
            name: string,
            url: string
        }
    };
    damage_class: {
        name: string,
        url: string
    };
    egg_groups: [];
    evolution_chain: {
        url: string
    };
    evolves_from_species: {
        name: string;
    };
    forms: [];
    flavor_text_entries: FlavorText[];
    gameIndices: [];
    gender_rate: number;
    hatch_counter: number;
    height: number;
    heldItems: [];
    id: number;
    isDefault: boolean;
    locationAreaEncounters: string;
    moves: [];
    name: string;
    order: number;
    pastTypes: [];
    species: {};
    sprites: {
        back_default: string,
        front_default: string,
        other: {
            dream_world: {}
            home: {
                front_default: string
            }
        }
    };
    stats: [];
    types: [
        {
            slot: number,
            type: { name: string}
        }
    ];
    weight: number;
    public url: any;

    get img(): string{
        return this.sprites?.other.home.front_default;
    }

    get tinyImg(): string{
        return this.sprites?.front_default;
    }

    get description(): string{
        return this.flavor_text_entries[11].flavor_text;
    }

    evolutionLevel(isBabyPoke: boolean): number{
        if(isBabyPoke || !this.chain.evolves_to[0].evolves_to[0]){
            if(!this.chain.evolves_to[0]){
                return null;
            }
            return this.chain.evolves_to[0].evolution_details[0].min_level;
        }
        else{
            return this.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level;
        }
    }

    evolution(isBabyPoke: boolean): string{
        if(isBabyPoke || !this.chain.evolves_to[0].evolves_to[0]){
            if(!this.chain.evolves_to[0]){
                return this.chain.species.name;
            }
            return this.chain.evolves_to[0].species.name;
        }
        else{
            return this.chain.evolves_to[0].evolves_to[0].species.name;
        }
    }

    evoUrlToImage(isBabyPoke: boolean): string{
        if(isBabyPoke || !this.chain.evolves_to[0].evolves_to[0]){
            if(!this.chain.evolves_to[0]){
                return this.chain.species.url;
            }
            return this.chain.evolves_to[0].species.url;
        }
        else{
            return this.chain.evolves_to[0].evolves_to[0].species.url;
        }
    }

}