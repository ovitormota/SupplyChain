import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Entry } from "../../models/Entry";
import { Product } from "../../models/Product";
import EntryService from "../../services/EntryService";
import ProductService from "../../services/ProductService";

const EntryForm: React.FC = () => {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { id } = useParams<{ id: string }>();

  const validationSchema = Yup.object({
    product_id: Yup.number().required("Produto é obrigatório"),
    quantity: Yup.number()
      .required("Quantidade é obrigatória")
      .min(1, "Quantidade deve ser maior que 0"),
    date_time: Yup.string().required("Data e Hora são obrigatórios"),
    location: Yup.string().required("Local é obrigatório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Entry>({
    resolver: yupResolver(validationSchema),
    defaultValues: entry || {
      product_id: 0,
      quantity: 0,
      date_time: "",
      location: "",
    },
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await ProductService.getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    loadProducts();
    
    const fetchEntry = async () => {
      if (id) {
        try {
          const fetchedEntry = await EntryService.getEntryById(Number(id));
          setEntry(fetchedEntry);
          reset({
            product_id: fetchedEntry?.product_id || 0,
            quantity: fetchedEntry?.quantity || 0,
            date_time: fetchedEntry?.date_time || "",
            location: fetchedEntry?.location || "",
          });
        } catch (error) {
          toast.error("Erro ao carregar entrada");
        }
      }
    };

    fetchEntry();
  }, [id, reset]);

  const onSubmit = async (data: Entry) => {
    try {
      if (entry?.id) {
        await EntryService.updateEntry(entry.id, data);
        toast.success("Entrada atualizada com sucesso!");
      } else {
        await EntryService.createEntry(data);
        toast.success("Entrada registrada com sucesso!");
      }
      navigate("/entradas/listagem");
    } catch (error) {
      toast.error("Erro ao salvar entrada");
    }
  };

  const handleBack = () => {
    navigate("/entradas/listagem");
  };

  if (!entry && id) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        {entry ? "Editar Entrada" : "Cadastrar Entrada"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Produto</InputLabel>
          <Select
            label="Produto"
            {...register("product_id")}
            error={!!errors.product_id}
            defaultValue={entry?.product_id || ""}
          >
            <MenuItem value="">Selecione um produto</MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {errors.product_id && (
          <Typography color="error" variant="body2">
            {errors.product_id.message}
          </Typography>
        )}

        <TextField
          label="Quantidade"
          type="number"
          fullWidth
          required
          margin="normal"
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
          {...register("quantity")}
        />

        <TextField
          label="Data e Hora"
          type="datetime-local"
          fullWidth
          required
          margin="normal"
          error={!!errors.date_time}
          helperText={errors.date_time?.message}
          {...register("date_time")}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Local"
          fullWidth
          required
          margin="normal"
          error={!!errors.location}
          helperText={errors.location?.message}
          {...register("location")}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          {entry ? "Salvar Alterações" : "Cadastrar Entrada"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleBack}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </form>
    </Box>
  );
};

export default EntryForm;
