import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Exit } from "../../models/Exit";
import { Product } from "../../models/Product";
import ExitService from "../../services/ExitService";
import ProductService from "../../services/ProductService";

const ExitForm: React.FC = () => {
  const navigate = useNavigate();
  const [exit, setExit] = useState<Exit | null>(null);
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
  } = useForm<Exit>({
    resolver: yupResolver(validationSchema),
    defaultValues: exit || {
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

    const fetchExit = async () => {
      if (id) {
        try {
          const fetchedExit = await ExitService.getExitById(Number(id));
          setExit(fetchedExit);
          reset({
            product_id: fetchedExit?.product_id || 0,
            quantity: fetchedExit?.quantity || 0,
            date_time: fetchedExit?.date_time || "",
            location: fetchedExit?.location || "",
          });
        } catch (error) {
          toast.error("Erro ao carregar saída");
        }
      }
    };

    fetchExit();
  }, [id, reset]);

  const onSubmit = async (data: Exit) => {
    try {
      if (exit?.id) {
        await ExitService.updateExit(exit.id, data);
        toast.success("Saída atualizada com sucesso!");
      } else {
        await ExitService.createExit(data);
        toast.success("Saída registrada com sucesso!");
      }
      navigate("/saidas/listagem");
    } catch (error) {
      toast.error("Erro ao salvar saída");
    }
  };

  const handleBack = () => {
    navigate("/saidas/listagem");
  };

  if (!exit && id) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        {exit ? "Editar Saída" : "Cadastrar Saída"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Produto</InputLabel>
          <Select
            label="Produto"
            {...register("product_id")}
            error={!!errors.product_id}
            defaultValue={exit?.product?.id || ""}
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
          {exit ? "Salvar Alterações" : "Cadastrar Saída"}
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

export default ExitForm;
