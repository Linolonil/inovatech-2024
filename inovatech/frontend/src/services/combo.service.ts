import { ICombo, IDevice } from "../models/Device";

interface ComboState {
    deviceId: string;
    sequence: number[];
    lastPress: number;
}

const comboStates = new Map<string, ComboState>();

export class ComboDetector {
    private device: IDevice;
    private timeout: number;

    constructor(device: IDevice) {
        this.device = device;
        this.timeout =  1500;
        
    }

    /**
     * Adiciona um botão à sequência e verifica se forma um combo
     */
    addButton(buttonId: number): {
        completed: boolean;
        combo?: ICombo;
        currentSequence: number[];
    } {
        const now = Date.now();
        let state = comboStates.get(this.device.deviceId);

        // Inicializar ou resetar estado se timeout
        if (!state || (now - state.lastPress) > this.timeout) {
            state = {
                deviceId: this.device.deviceId,
                sequence: [],
                lastPress: now
            };
        }

        // Adicionar botão à sequência
        state.sequence.push(buttonId);
        state.lastPress = now;
        comboStates.set(this.device.deviceId, state);

        // Verificar se formou um combo
        const exactMatch = this.findMatchingCombo(state.sequence);

        // Verificar se existe combo mais longo que começa igual
        const hasLongerPossibility = this.device.config.combos.some(combo =>
            combo.sequence.length > state.sequence.length &&
            this.isPartialMatch(state.sequence, combo.sequence)
        );

        // Se houve match exato, mas ainda existe combo maior possível, aguarda
        if (exactMatch && hasLongerPossibility) {
            return {
                completed: false,
                currentSequence: [...state.sequence]
            };
        }

        // Se houve match exato e não há combos maiores possíveis, completa
        if (exactMatch && !hasLongerPossibility) {
            comboStates.delete(this.device.deviceId);
            return {
                completed: true,
                combo: exactMatch,
                currentSequence: [...state.sequence]
            };
        }

        // Verificar se ainda pode formar um combo válido
        const hasPartialMatch = this.hasPartialMatch(state.sequence);

        if (!hasPartialMatch) {
            // Nenhum combo possível com essa sequência - resetar
            comboStates.delete(this.device.deviceId);
            return {
                completed: false,
                currentSequence: []
            };
        }

        return {
            completed: false,
            currentSequence: [...state.sequence]
        };
    }

    /**
     * Busca combo que corresponda exatamente à sequência
     */
    private findMatchingCombo(sequence: number[]): ICombo | null {
        return this.device.config.combos.find(combo =>
            this.arraysEqual(combo.sequence, sequence)
        ) || null;
    }

    /**
     * Verifica se a sequência atual pode levar a um combo válido
     */
    private hasPartialMatch(sequence: number[]): boolean {
        return this.device.config.combos.some(combo =>
            this.isPartialMatch(sequence, combo.sequence)
        );
    }

    /**
     * Verifica se uma sequência é início de outra
     */
    private isPartialMatch(partial: number[], full: number[]): boolean {
        if (partial.length > full.length) return false;

        for (let i = 0; i < partial.length; i++) {
            if (partial[i] !== full[i]) return false;
        }

        return true;
    }

    /**
     * Compara dois arrays
     */
    private arraysEqual(a: number[], b: number[]): boolean {
        if (a.length !== b.length) return false;
        return a.every((val, index) => val === b[index]);
    }

    /**
     * Obtém sequência atual (para debug/UI)
     */
    getCurrentSequence(): number[] {
        const state = comboStates.get(this.device.deviceId);
        return state ? [...state.sequence] : [];
    }

    /**
     * Limpa estado do combo (timeout ou manual)
     */
    reset(): void {
        comboStates.delete(this.device.deviceId);
    }

    /**
     * Lista todos os combos possíveis agrupados por categoria
     */
    static getCombosByCategory(device: IDevice): Record<string, ICombo[]> {
        const grouped: Record<string, ICombo[]> = {};

        device.config.combos.forEach(combo => {
            const category = combo.category || "Geral";
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(combo);
        });

        return grouped;
    }
}

/**
 * Limpa estados antigos periodicamente (cleanup)
 */
setInterval(() => {
    const now = Date.now();
    const timeout = 5000; // 5 segundos

    for (const [deviceId, state] of comboStates.entries()) {
        if ((now - state.lastPress) > timeout) {
            comboStates.delete(deviceId);
        }
    }
}, 10000); // Executa a cada 10 segundos