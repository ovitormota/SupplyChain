import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Product } from "../../models/Product";
import ProductService from "../../services/ProductService";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await ProductService.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ProductService.deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", padding: 2 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Grid >
          <Typography variant="h5" >
            Produtos
          </Typography>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/produtos/cadastro")}
          >
            Novo Produto
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {/* <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Número do registro</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fabricante</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                {/* <TableCell>{product.id}</TableCell> */}
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.registration_number}</TableCell>
                <TableCell>{product.manufacturer}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/produtos/editar/${product.id}`)}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product.id as number)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;
