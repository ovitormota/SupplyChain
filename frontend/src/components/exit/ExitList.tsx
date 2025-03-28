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
import ExitService from "../../services/ExitService";
import { Exit } from "../../models/Exit";
import { format } from "date-fns";

const ExitList: React.FC = () => {
  const [exits, setExits] = useState<Exit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadExits();
  }, []);

  const loadExits = async () => {
    try {
      const fetchedExits = await ExitService.getExits();
      setExits(fetchedExits);
    } catch (error) {
      console.error("Error fetching exits:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ExitService.deleteExit(id);
      setExits((prevExits) => prevExits.filter((exit) => exit.id !== id));
      toast.success("Saída excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir saída");
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
        <Grid>
          <Typography variant="h5">Saídas</Typography>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/saidas/cadastro")}
          >
            Nova Saída
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {/* <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>Produto</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantidade</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Data/Hora</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Local</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exits.map((exit) => (
              <TableRow key={exit.id}>
                {/* <TableCell>{exit.id}</TableCell> */}
                <TableCell>{exit.product?.name}</TableCell>
                <TableCell>{exit.quantity}</TableCell>
                <TableCell>{format(new Date(exit.date_time), "yyyy-MM-dd HH:mm")}</TableCell>
                <TableCell>{exit.location}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/saidas/editar/${exit.id}`)}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(exit.id as number)}
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

export default ExitList;
