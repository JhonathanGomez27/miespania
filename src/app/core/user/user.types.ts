export interface User
{
    id: string;
    nombre: string,
    apellido: string,
    nombre_a_mostrar: string,
    rol?: string;
    correo: string;
    imagen_perfil: any;
}
