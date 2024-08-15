import z from 'zod'

export const citasForm = z.object({
    cita: z.string().min(1, {
        message: "El campo no puede estar vacío.",
    }),
    pagina: z.string()
        .min(1, {
            message: "El campo no puede estar vacío.",
        })
        .refine((val) => /^\d+$/.test(val), {
            message: "El campo solo puede contener números",
        }),
    libroId: z.string().min(1, {
        message: "El campo no puede estar vacío.",
    }),
    autorId: z.string().min(1, {
        message: "El campo no puede estar vacío.",
    })
});


export const libroSchema = z.object({
    titulo: z.string().min(1, {
        message: "El campo no puede estar vacío.",
    }),
    autorId: z.string().min(1, {
        message: "El campo no puede estar vacío.",
    })
})
export const AutorSchema = z.object({
    name: z.string().min(1, {
        message: "El campo no puede estar vacío.",
    }),

})