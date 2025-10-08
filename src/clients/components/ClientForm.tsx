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
import { toast } from "react-hot-toast";

// ✅ Esquema Zod actualizado con tipo de pago y nuevos campos
const clientSchema = z.object({
  dui: z.string().regex(/^\d{8}-\d+$/, {
    message:
      "El DUI debe tener al menos 8 dígitos, un guion y 1 dígito final (ej: 01234567-8)",
  }),
  nombre: z
    .string()
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-,]+$/, {
      message:
        "El nombre solo puede contener letras, espacios, guiones y comas",
    })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  apellido: z
    .string()
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-,]+$/, {
      message:
        "El apellido solo puede contener letras, espacios, guiones y comas",
    })
    .min(3, { message: "El apellido debe tener al menos 3 caracteres" }),

  referencia: z.string().optional(),
  observaciones: z.string().optional(),

  ultimoMes: z
    .number()
    .min(1, { message: "El mes mínimo es 1" })
    .max(12, { message: "El mes máximo es 12" }),
  ultimoAnio: z
    .number()
    .min(2025, { message: "El año no puede ser menor a 2025" }),
  estado: z.enum(["Activo", "Exonerado", "Desconectado"], {
    message: "El estado es obligatorio",
  }),
  pagoTipo: z.enum(["maximo", "medio", "minimo"], {
    message: "El tipo de pago es obligatorio",
  }),
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
      referencia: "",
      observaciones: "",
      ultimoMes: 1,
      ultimoAnio: new Date().getFullYear(),
      estado: "Activo",
      pagoTipo: "maximo",
    },
  });

  return (
    <div className="flex justify-center px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Registro de Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, (formErrors) => {
              if (formErrors.dui?.message) toast.error(formErrors.dui.message);
            })}
            className="grid gap-6 sm:grid-cols-2"
          >
            {/* DUI */}
            <div className="sm:col-span-2">
              <Label className="mb-2" htmlFor="dui">
                DUI
              </Label>
              <Input
                placeholder="01234567-8"
                className={errors.dui ? "border-red-500" : ""}
                {...register("dui", {
                  onChange: (e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 8) {
                      value = value.slice(0, 8) + "-" + value.slice(8, 9);
                    }
                    setValue("dui", value);
                  },
                })}
              />
              {errors.dui && (
                <p className="text-red-500 text-sm">{errors.dui.message}</p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <Label className="mb-2" htmlFor="nombre">
                Nombre
              </Label>
              <Input
                {...register("nombre")}
                placeholder="Nombre"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">{errors.nombre.message}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <Label className="mb-2" htmlFor="apellido">
                Apellido
              </Label>
              <Input
                {...register("apellido")}
                placeholder="Apellido"
                className={errors.apellido ? "border-red-500" : ""}
              />
              {errors.apellido && (
                <p className="text-red-500 text-sm">
                  {errors.apellido.message}
                </p>
              )}
            </div>

            {/* Referencia */}
            <div className="sm:col-span-2">
              <Label className="mb-2" htmlFor="referencia">
                Referencia
              </Label>
              <Input
                {...register("referencia")}
                placeholder="Ej: Cerca del parque central"
                className={errors.referencia ? "border-red-500" : ""}
              />
              {errors.referencia && (
                <p className="text-red-500 text-sm">
                  {errors.referencia.message}
                </p>
              )}
            </div>

            {/* Último Mes */}
            <div>
              <Label className="mb-2" htmlFor="ultimoMes">
                Último Mes Pagado
              </Label>
              <Input
                type="number"
                min={1}
                max={12}
                {...register("ultimoMes", { valueAsNumber: true })}
                className={errors.ultimoMes ? "border-red-500" : ""}
              />
              {errors.ultimoMes && (
                <p className="text-red-500 text-sm">
                  {errors.ultimoMes.message}
                </p>
              )}
            </div>

            {/* Último Año */}
            <div>
              <Label className="mb-2" htmlFor="ultimoAnio">
                Año
              </Label>
              <Input
                type="number"
                min={2025}
                {...register("ultimoAnio", { valueAsNumber: true })}
                className={errors.ultimoAnio ? "border-red-500" : ""}
              />
              {errors.ultimoAnio && (
                <p className="text-red-500 text-sm">
                  {errors.ultimoAnio.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div className="sm:col-span-2">
              <Label className="mb-2" htmlFor="estado">
                Estado
              </Label>
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
              {errors.estado && (
                <p className="text-red-500 text-sm">{errors.estado.message}</p>
              )}
            </div>

            {/* Tipo de Pago */}
            <div className="sm:col-span-2">
              <Label className="mb-2" htmlFor="pagoTipo">
                Tipo de Pago
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue("pagoTipo", val as ClientFormData["pagoTipo"])
                }
                defaultValue="maximo"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maximo">Máximo</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="minimo">Mínimo</SelectItem>
                </SelectContent>
              </Select>
              {errors.pagoTipo && (
                <p className="text-red-500 text-sm">
                  {errors.pagoTipo.message}
                </p>
              )}
            </div>

            {/* Observaciones */}
            <div className="sm:col-span-2">
              <Label className="mb-2" htmlFor="observaciones">
                Observaciones
              </Label>
              <Input
                {...register("observaciones")}
                placeholder="Observaciones..."
                className={errors.observaciones ? "border-red-500" : ""}
              />
              {errors.observaciones && (
                <p className="text-red-500 text-sm">
                  {errors.observaciones.message}
                </p>
              )}
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
    </div>
  );
}
