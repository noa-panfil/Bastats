'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createExercise(formData: FormData) {
    const name = formData.get('name') as string;
    const unit = formData.get('unit') as string;

    if (!name) {
        throw new Error("Exercise name is required");
    }

    await prisma.exercise.create({
        data: {
            name,
            unit: unit || null,
        },
    });

    revalidatePath('/exercises');
    redirect('/exercises');
}
