import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import { jsPDF } from "jspdf";
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const ReportGenerator: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState<string | "all">("all");
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const productResponse = await api.get("/products");
        setProducts(productResponse.data);

        const monthResponse = await api.get("/months", {
          params: { product: selectedProduct },
        });
        setMonths(monthResponse.data);
      } catch (error) {
        setError("Erro ao carregar produtos e meses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [selectedProduct]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/report", {
          params: { product: selectedProduct, month: selectedMonth },
        });
        setReportData(response.data);
      } catch (error) {
        setError("Erro ao carregar os dados do relatório.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProduct, selectedMonth]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relatório de Entradas e Saídas", 20, 20);
    doc.setFontSize(10);

    const headers = ["Data", "Produto", "Entradas", "Saídas"];
    let yPosition = 40;

    headers.forEach((header, index) => {
      doc.text(header, 20 + index * 50, yPosition);
    });

    yPosition += 10;

    if (reportData.length === 0) {
      doc.text(
        "Nenhum dado encontrado para os filtros selecionados.",
        20,
        yPosition
      );
    } else {
      reportData.forEach((item: any) => {
        const row = [
          formatDate(item.date_time),
          item.product_name,
          item.total_entries,
          item.total_exits,
        ];
        row.forEach((data, idx) => {
          doc.text(data.toString(), 20 + idx * 50, yPosition);
        });
        yPosition += 10;
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }

    doc.save("relatorio_entradas_saidas.pdf");
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Gerar Relatório de Entradas e Saídas
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ marginTop: 2 }}
        >
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Produto</InputLabel>
              <Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                label="Produto"
              >
                <MenuItem value="all">Todos os Produtos</MenuItem>
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <FormControl fullWidth>
              <InputLabel>Mês</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label="Mês"
              >
                <MenuItem value="all">Todos os Meses</MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              startIcon={<PictureAsPdfIcon />}
              sx={{
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Gerar Relatório
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportGenerator;
