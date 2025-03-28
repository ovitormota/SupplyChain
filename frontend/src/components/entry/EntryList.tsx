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
import { Entry } from "../../models/Entry";
import EntryService from "../../services/EntryService";
import { format } from "date-fns";

const EntryList: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const fetchedEntries = await EntryService.getEntries();
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await EntryService.deleteEntry(id);
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
      toast.success("Entrada excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir entrada");
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
          <Typography variant="h5">Entradas</Typography>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/entradas/cadastro")}
          >
            Nova Entrada
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
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                {/* <TableCell>{entry.id}</TableCell> */}
                <TableCell>{entry.product?.name}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>{format(new Date(entry.date_time), "yyyy-MM-dd HH:mm")}</TableCell>
                <TableCell>{entry.location}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/entradas/editar/${entry.id}`)}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(entry.id as number)}
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

export default EntryList;
