import { useAutoresStore } from "@/store/autores"
import { useCitasStore } from "@/store/citas"
import { useLibrosStore } from "@/store/libros"
import { BookMarked, BookOpen, UserRoundPen } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { AlertDelete } from "../alert-delete"

export default function Libro() {
    const params = useParams()

    const citas = useCitasStore((state) => state.citas)
    const libros = useLibrosStore((state) => state.libros)
    const autores = useAutoresStore((state) => state.autores)
    const initLibros = useLibrosStore((state) => state.initLibros)
    const initCitas = useCitasStore((state) => state.initCitas)


    const autoresMap = new Map(autores.map(autor => [autor.id, autor]));
    const librosMap = new Map(libros.map(libro => [libro.id, libro]));

    const allCitas = citas.filter(cita => cita.libroId === params.id)

    const navitage=useNavigate()

    const handleDeleteLibro = () => {


        //Eliminar libro por autor
        const deleteLibro = libros.filter(libro => libro.id !== params.id)
        initLibros(deleteLibro)

        //Eliminar autor pasado
        const deleteLibroCita = citas.filter(cita => cita.libroId !== params.id)
        initCitas(deleteLibroCita)

        //Recoger el estado actual
        const citasActualizados = useCitasStore.getState().citas
        const librosActualizados = useLibrosStore.getState().libros

        //Guardar el estado
        localStorage.setItem("citas", JSON.stringify(citasActualizados))
        localStorage.setItem("libros", JSON.stringify(librosActualizados))

        toast.success("Libro borrada")

        navitage("/")
    }

    const handleDeleteCita = (id: string) => {



        //Eliminar autor pasado
        const deleteCita = citas.filter(cita => cita.id !== id)
        initCitas(deleteCita)

        //Recoger el estado actual
        const citasActualizados = useCitasStore.getState().citas

        //Guardar el estado
        localStorage.setItem("citas", JSON.stringify(citasActualizados))


        toast.success("Cita borrado")


    }
    return (
        <div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 ">
                <div className="grid grid-cols-[60px_1fr] items-center">
                    <BookMarked className=" size-10 p-2 rounded-full text-black bg-white" />
                    <h1 className="text-2xl font-bold">Libros de {params.titulo}</h1>
                </div>
                <AlertDelete name="Borrar libro" title="¿Estas a punto de borrar este libro?" description="Al borrar el libro también se borrarán todas sus citas" handleDelete={handleDeleteLibro} />
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

                {allCitas.length > 0 ? (<>
                    {allCitas.map(cita => {
                        const libro = librosMap.get(cita.libroId);
                        const autor = libro ? autoresMap.get(libro.autorId) : null;
                        return (
                            <>
                                <div key={cita.id+""+libro?.id} className="mt-5 text-black rounded-lg shadow-xl p-4 flex flex-col justify-between gap-2 bg-slate-100">
                                    <p className="font-bold text-xl overflow-y-auto h-[125px] text-start">{cita.cita}</p>
                                    <div className="flex justify-between items-center gap-5">
                                        <div className="flex flex-col gap-2">
                                            <p className="italic opacity-85 text-sm flex flex-row gap-2 items-center"><BookOpen className="size-4" /> {libro ? libro.titulo : 'No disponible'}</p>
                                            <p className="italic opacity-85 text-sm flex flex-row gap-2 items-center"><UserRoundPen className="size-4" /> {autor ? autor.name : 'No disponible'}</p>
                                        </div>
                                        <p className="italic opacity-85 text-sm">Página {cita ? cita.pagina : 'No disponible'}</p>
                                    </div>
                                    <AlertDelete title="¿Quieres borrar esta cita?" description="" name="Borrar cita" handleDelete={() => handleDeleteCita(cita.id)} />

                                </div>
                            </>
                        )
                    })}
                </>) : (<p className="mt-5">Este libro todavía no tiene ninguna cita ✒</p>)}

            </section>
        </div>


    )
}
