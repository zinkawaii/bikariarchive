export interface EXCalcData {
    name: string;
    main: number[];
    pioneer: number[];
    time: number;
    health: number;
    times: number;
    bukis: EXCalcBuki[];
}

export interface EXCalcBuki {
    name: string;
    damage: number;
    hit: number;
    accuracyRate: number;
    critRate: number;
    critDamage: number;
}