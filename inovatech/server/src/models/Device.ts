import mongoose, { Document, Schema } from "mongoose";

export interface ICombo {
    sequence: number[]; // Ex: [1, 2, 3] = Vermelho → Azul → Verde
    message: string; // Mensagem resultante
    category?: string; // Categoria para organização (opcional)
}

export interface IDevice extends Document {
    _id: Schema.Types.ObjectId;
    deviceId: string;
    owner: Schema.Types.ObjectId;
    name?: string;
    config: {
        buttons: {
            // Mapeamento buttonId → cor/emoção base
            [key: number]: string;
        };
        combos: ICombo[];
        comboTimeout?: number; // Tempo máximo entre botões (ms) - padrão 3000
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const comboSchema = new Schema<ICombo>({
    sequence: { type: [Number], required: true },
    message: { type: String, required: true },
    category: { type: String }
}, { _id: false });

const deviceSchema = new Schema<IDevice>(
    {
        deviceId: { type: String, required: true, unique: true },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String },
        config: {
            type: {
                buttons: { type: Map, of: String, default: {} },
                combos: { type: [comboSchema], default: [] },
                comboTimeout: { type: Number, default: 3000 }
            },
            default: () => ({
                buttons: {},
                combos: [],
                comboTimeout: 3000
            })
        }
    },
    { timestamps: true }
);

deviceSchema.index({ owner: 1 });

const Device = mongoose.model<IDevice>("Device", deviceSchema);

export default Device;