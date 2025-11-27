'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Definindo o tipo ICombo para ser usado aqui também
interface ICombo {
    sequence: number[];
    message: string;
    category: string;
}

// Schema de validação com Zod
const comboSchema = z.object({
    message: z.string().min(1, 'A mensagem é obrigatória.'),
    category: z.string().min(1, 'A categoria é obrigatória.'),
    sequence: z.string().min(1, 'A sequência é obrigatória.').transform((val) =>
        val.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num))
    ),
});

type ComboFormData = z.infer<typeof comboSchema>;

interface ComboEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (combo: ICombo) => void;
    comboToEdit?: ICombo | null; // Combo a ser editado (opcional)
}

export function ComboEditorModal({ isOpen, onClose, onSave, comboToEdit }: ComboEditorModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ComboFormData>({
        resolver: zodResolver(comboSchema),
    });

    const isEditing = !!comboToEdit;

    // Preenche o formulário se estiver no modo de edição
    useEffect(() => {
        if (isEditing && comboToEdit) {
            reset({
                message: comboToEdit.message,
                category: comboToEdit.category,
                sequence: comboToEdit.sequence.join(', '),
            });
        } else {
            reset({ message: '', category: '', sequence: '' });
        }
    }, [comboToEdit, isEditing, reset, isOpen]);

    const onSubmit = (data: ComboFormData) => {
        onSave(data as ICombo);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Combo' : 'Adicionar Novo Combo'}</DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes do combo. A sequência deve ser de números separados por vírgula.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                            Mensagem
                        </Label>
                        <div className="col-span-3">
                            <Input id="message" {...register('message')} className="w-full" />
                            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Categoria
                        </Label>
                        <div className="col-span-3">
                            <Input id="category" {...register('category')} className="w-full" />
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sequence" className="text-right">
                            Sequência
                        </Label>
                        <div className="col-span-3">
                            <Input id="sequence" {...register('sequence')} placeholder="Ex: 1, 2, 1" className="w-full" />
                            {errors.sequence && <p className="text-red-500 text-xs mt-1">{errors.sequence.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
