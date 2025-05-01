class EXCalcData {
    health!: number;
    times!: number;
    bukis!: EXCalcBuki[];
}

class EXCalcBuki {
    damage!: number;
    hit!: number;
    accuracyRate!: number;
    critRate!: number;
    critDamage!: number;
}

export function roll(data: EXCalcData): f64 {
    let kill = 0;
    for (let t = 0; t < data.times; t++) {
        const health = data.bukis.reduce((hp, buki) => {
            let damage = 0.00;
            for (let i = 0; i < buki.hit; i++) {
                if (isRateEffect(buki.accuracyRate)) {
                    damage += buki.damage * (isRateEffect(buki.critRate) ? (buki.critDamage / 100) : 1.00);
                }
            }
            return hp + damage;
        }, 0.00);

        if (health >= data.health) {
            kill++;
        }
    }
    return (data.times) > 0 ? kill / data.times : 0;
}

function isRateEffect(rate: f64): boolean {
    return Math.random() * 100 < rate;
}
