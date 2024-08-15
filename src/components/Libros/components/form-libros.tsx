import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { libroSchema } from "@/schema"
import { useAutoresStore } from "@/store/autores"
import { useLibrosStore } from "@/store/libros"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { BookMarked, BookType } from "lucide-react"
import { useState } from "react"


export function FormLibros() {

    const [open, setOpen] = useState(false)

    const setLibros = useLibrosStore((state) => state.setLibros)
    const libros = useLibrosStore((state) => state.libros)
    const autores = useAutoresStore((state) => state.autores)

    // 1. Define your form.
    const form = useForm<z.infer<typeof libroSchema>>({
        resolver: zodResolver(libroSchema),
        defaultValues: {
            titulo: "",
            autorId: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof libroSchema>) {

        const libroExist = libros.find(libro => libro.titulo === values.titulo)

        if (libroExist) {
            form.setError("titulo", {
                message: "Este libro ya existe"
            })
            return
        }

        const libro = {
            id: crypto.randomUUID(),
            titulo: values.titulo,
            autorId: values.autorId
        }
        setLibros(libro)

        //recuperar el estado actualizado
        const librosActualizados = useLibrosStore.getState().libros

        localStorage.setItem("libros", JSON.stringify(librosActualizados))

        toast.success('El libro ha sido creado')
        form.setValue("titulo", "")
        form.setValue("autorId", "")

        setOpen(false)

    }


    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger asChild className="w-full">
                <Button variant="ghost" className="items-start justify-start p-2">
                    <div className="flex flex-row gap-2 items-center font-bold">
                        <BookType className="size-4" />
                        Añadir un libro
                    </div>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='overflow-y-auto'>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <div className="flex flex-row items-center">
                            <BookMarked className="size-10 p-2" />
                            <p className="font-bold">
                                Añade un libro
                            </p>
                        </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Para añadir un libro necesitas darle un título y seleccionar al autor que pertenece
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 ">
                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder='Título del libro' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="autorId"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un Autor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {autores.length > 0 ? (<>
                                                {autores.map(autor => (
                                                    <SelectItem key={autor.id} value={autor.id}>{autor.name}</SelectItem>
                                                ))}
                                            </>) : (<>
                                                <p className="text-center text-sm p-2">No hay autores todavía</p>
                                            </>)}

                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-2'>
                            <Button >Añadir</Button>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        </div>
                    </form>
                </Form>

            </AlertDialogContent>
        </AlertDialog>
    )
}
