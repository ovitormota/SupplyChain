import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom"; // Importando o hook useParams para acessar o ID da URL
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Product } from "../../models/Product";
import ProductService from "../../services/ProductService";

interface ProductFormProps {
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams<{ id: string }>();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .required("Nome é obrigatório"),
    registration_number: Yup.string().required(
      "Número de registro é obrigatório"
    ),
    manufacturer: Yup.string().required("Fabricante é obrigatório"),
    type: Yup.string().required("Tipo é obrigatório"),
    description: Yup.string().required("Descrição é obrigatória"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Product>({
    resolver: yupResolver(validationSchema),
    defaultValues: product || {
      name: "",
      registration_number: "",
      manufacturer: "",
      type: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const fetchedProduct = await ProductService.getProductById(
            Number(id)
          );
          setProduct(fetchedProduct);
          reset(fetchedProduct);
        } catch (error) {
          toast.error("Erro ao carregar produto");
        }
      }
    };

    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data: Product) => {
    try {
      if (product?.id) {
        await ProductService.updateProduct(product.id, data);
        toast.success("Produto atualizado com sucesso!");
        navigate("/produtos/listagem");
      } else {
        await ProductService.createProduct(data);
        toast.success("Produto criado com sucesso!");
        reset();
        handleBack();
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao salvar produto");
    }
  };

  const handleBack = () => {
    navigate("/produtos/listagem");
  };

  if (!product && id) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        {product ? "Editar Produto" : "Criar Produto"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Nome"
          fullWidth
          required
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="Número de Registro"
          fullWidth
          required
          margin="normal"
          error={!!errors.registration_number}
          helperText={errors.registration_number?.message}
          {...register("registration_number")}
        />
        <TextField
          label="Fabricante"
          fullWidth
          required
          margin="normal"
          error={!!errors.manufacturer}
          helperText={errors.manufacturer?.message}
          {...register("manufacturer")}
        />
        <TextField
          label="Tipo"
          fullWidth
          required
          margin="normal"
          error={!!errors.type}
          helperText={errors.type?.message}
          {...register("type")}
        />
        <TextField
          label="Descrição"
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register("description")}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          {product ? "Salvar Alterações" : "Criar Produto"}
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

export default ProductForm;
