import { ICombo } from "../models/Device";

export const DEFAULT_COMBOS: ICombo[] = [
    { sequence: [1, 1], message: "Olá!", category: "Saudações" },
    { sequence: [1, 2], message: "Bom dia!", category: "Saudações" },
    { sequence: [1, 3], message: "Boa tarde!", category: "Saudações" },
    { sequence: [1, 4], message: "Boa noite!", category: "Saudações" },
    { sequence: [1, 5], message: "Tchau!", category: "Saudações" },

    { sequence: [2, 1], message: "Estou feliz!", category: "Emoções" },
    { sequence: [2, 2], message: "Estou triste", category: "Emoções" },
    { sequence: [2, 3], message: "Estou com raiva", category: "Emoções" },
    { sequence: [2, 4], message: "Estou com medo", category: "Emoções" },
    { sequence: [2, 5], message: "Estou calmo", category: "Emoções" },
    { sequence: [2, 6], message: "Estou animado!", category: "Emoções" },
    { sequence: [2, 2, 2], message: "Estou muito triste", category: "Emoções" },
    { sequence: [2, 3, 3], message: "Estou muito bravo!", category: "Emoções" },

    { sequence: [3, 1], message: "Preciso de ajuda", category: "Necessidades" },
    { sequence: [3, 2], message: "Estou com fome", category: "Necessidades" },
    { sequence: [3, 3], message: "Estou com sede", category: "Necessidades" },
    { sequence: [3, 4], message: "Quero ir ao banheiro", category: "Necessidades" },
    { sequence: [3, 5], message: "Estou cansado", category: "Necessidades" },
    { sequence: [3, 6], message: "Sinto dor", category: "Necessidades" },

    { sequence: [4, 1], message: "Sim", category: "Respostas" },
    { sequence: [4, 2], message: "Não", category: "Respostas" },
    { sequence: [4, 3], message: "Talvez", category: "Respostas" },
    { sequence: [4, 4], message: "Obrigado", category: "Respostas" },
    { sequence: [4, 5], message: "Por favor", category: "Respostas" },
    { sequence: [4, 6], message: "Desculpa", category: "Respostas" },
    { sequence: [4, 1, 1], message: "Sim, com certeza!", category: "Respostas" },
    { sequence: [4, 2, 2], message: "Não quero!", category: "Respostas" },

    { sequence: [5, 1], message: "Quero brincar", category: "Atividades" },
    { sequence: [5, 2], message: "Quero ficar em casa", category: "Atividades" },
    { sequence: [5, 3], message: "Quero desenhar", category: "Atividades" },
    { sequence: [5, 4], message: "Quero assistir TV", category: "Atividades" },
    { sequence: [5, 5], message: "Quero ouvir música", category: "Atividades" },
    { sequence: [5, 6], message: "Quero dormir", category: "Atividades" },

    { sequence: [6, 1], message: "Quero a mamãe", category: "Pessoas" },
    { sequence: [6, 2], message: "Quero o papai", category: "Pessoas" },
    { sequence: [6, 3], message: "Quero ficar sozinho", category: "Pessoas" },
    { sequence: [6, 4], message: "Quero um abraço", category: "Pessoas" },
    { sequence: [6, 5], message: "Quero meu amigo", category: "Pessoas" },

    { sequence: [2, 1, 4, 4], message: "Estou muito feliz, obrigado!", category: "Expressões" },
    { sequence: [2, 1, 5, 1], message: "Estou feliz e quero brincar!", category: "Expressões" },
    { sequence: [3, 1, 6, 1], message: "Preciso de ajuda da mamãe", category: "Urgências" },
    { sequence: [3, 1, 6, 2], message: "Preciso de ajuda do papai", category: "Urgências" },
    { sequence: [2, 2, 6, 4], message: "Estou triste, quero um abraço", category: "Expressões" },
    { sequence: [2, 3, 3, 4], message: "Estou com muita raiva, preciso ir ao banheiro!", category: "Urgências" },
    { sequence: [3, 5, 5, 6], message: "Estou muito cansado, quero dormir", category: "Urgências" },
    { sequence: [1, 2, 4, 4], message: "Bom dia, obrigado!", category: "Cortesia" },
    { sequence: [1, 5, 4, 5], message: "Tchau, por favor volte logo!", category: "Cortesia" },
];

export const DEFAULT_BUTTON_MAPPING: Record<number, string> = {
    1: "vermelho",
    2: "branco1",
    3: "azul",
    4: "verde",
    5: "branco2",
    6: "preto"
};