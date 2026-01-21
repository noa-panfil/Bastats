'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPlayer(formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const photoUrl = formData.get('photoUrl') as string;

    if (!firstName) {
        throw new Error("First name is required");
    }

    await prisma.player.create({
        data: {
            firstName,
            photoUrl: photoUrl || null,
        },
    });

    revalidatePath('/players');
    redirect('/players');
}

export async function addResult(formData: FormData) {
    const playerId = parseInt(formData.get('playerId') as string);
    const exerciseId = parseInt(formData.get('exerciseId') as string);
    const value = parseFloat(formData.get('value') as string);

    if (!playerId || !exerciseId || isNaN(value)) {
        throw new Error("Invalid input");
    }

    await prisma.result.create({
        data: {
            playerId,
            exerciseId,
            value
        }
    });

    revalidatePath(`/players/${playerId}`);
    revalidatePath(`/exercises/${exerciseId}`);
}

export async function updatePlayer(formData: FormData) {
    const rawId = formData.get('id');
    const id = parseInt(rawId as string);
    const firstName = formData.get('firstName') as string;
    const photoUrl = formData.get('photoUrl') as string;

    if (!id || isNaN(id) || !firstName) {
        throw new Error("Invalid input");
    }

    try {
        await prisma.player.update({
            where: { id },
            data: {
                firstName,
                photoUrl: photoUrl || null,
            },
        });
    } catch (error) {
        throw error;
    }

    revalidatePath(`/players/${id}`);
    revalidatePath('/players');
    redirect(`/players/${id}`);
}

export async function deletePlayer(formData: FormData) {
    const id = parseInt(formData.get('id') as string);

    if (!id || isNaN(id)) {
        throw new Error("Invalid input");
    }

    try {
        // Delete all results associated with the player first
        await prisma.result.deleteMany({
            where: { playerId: id }
        });

        // Then delete the player
        await prisma.player.delete({
            where: { id }
        });
        console.log("Player deleted successfully");
    } catch (error) {
        console.error("Failed to delete player:", error);
        throw error;
    }

    revalidatePath('/players');
    redirect('/players');
}
