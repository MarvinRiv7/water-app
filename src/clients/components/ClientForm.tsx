import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const clientSchema = z.object({
  dui: z.string().regex(/^\d{8}-\d$/, "Formato inválido. Ej: 01234567-8"),
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  ultimoMes: z.number().min(1).max(12),
  ultimoAnio: z.number().min(2025),
  estado: z.enum(["Activo", "Exonerado", "Desconectado"]),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  loading?: boolean;
}

export function ClientForm({ onSubmit, loading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      dui: "",
      nombre: "",
      apellido: "",
      ultimoMes: 1,
      ultimoAnio: new Date().getFullYear(),
      estado: "Activo",
    },
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Registro de Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6 sm:grid-cols-2"
        >
          {/* DUI */}
          <div className="sm:col-span-2">
            <Label htmlFor="dui">DUI</Label>
            <Input
              {...register("dui")}
              placeholder="01234567-8"
              className={errors.dui ? "border-red-500" : ""}
            />
            {errors.dui && (
              <p className="text-red-500 text-sm">{errors.dui.message}</p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input {...register("nombre")} placeholder="Nombre" />
            {errors.nombre && (
              <p className="text-red-500 text-sm">{errors.nombre.message}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input {...register("apellido")} placeholder="Apellido" />
            {errors.apellido && (
              <p className="text-red-500 text-sm">{errors.apellido.message}</p>
            )}
          </div>

          {/* Último Mes */}
          <div>
            <Label htmlFor="ultimoMes">Último Mes</Label>
            <Input
              type="number"
              min={1}
              max={12}
              {...register("ultimoMes", { valueAsNumber: true })}
            />
          </div>

          {/* Último Año */}
          <div>
            <Label htmlFor="ultimoAnio">Último Año</Label>
            <Input
              type="number"
              min={2025}
              {...register("ultimoAnio", { valueAsNumber: true })}
            />
          </div>

          {/* Estado */}
          <div className="sm:col-span-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              onValueChange={(val) =>
                setValue("estado", val as ClientFormData["estado"])
              }
              defaultValue="Activo"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Exonerado">Exonerado</SelectItem>
                <SelectItem value="Desconectado">Desconectado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón */}
          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Guardando..." : "💾 Guardar Cliente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
