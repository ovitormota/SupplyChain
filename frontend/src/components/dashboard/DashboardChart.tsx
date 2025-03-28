import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = {
  entries: {
    background: "rgba(34, 197, 94, 0.6)",
    border: "rgba(34, 197, 94, 1)",
  },
  exits: {
    background: "rgba(244, 63, 94, 0.6)",
    border: "rgba(244, 63, 94, 1)",
  },
};

interface DashboardItem {
  product_id: number;
  product_name: string;
  month: string;
  total_entries: number;
  total_exits: number;
}

interface Product {
  id: string;
  name: string;
}

const DashboardChart: React.FC = () => {
  const [data, setData] = useState<DashboardItem[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState<string | "all">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardResponse = await api.get("/dashboard");
        const dashboardData: DashboardItem[] = dashboardResponse.data;
        setData(dashboardData);

        const uniqueMonths = Array.from(
          new Set(dashboardData.map((item) => item.month))
        );
        setMonths(uniqueMonths);

        const uniqueProducts = Array.from(
          new Set(
            dashboardData.map(
              (item) => `${item.product_id}-${item.product_name}`
            )
          )
        ).map((productKey) => {
          const [id, name] = productKey.split("-");
          return { id, name };
        });
        setProducts(uniqueProducts);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableMonths = useMemo(() => {
    if (selectedProduct === "all") {
      return months.filter((month) =>
        data.some(
          (item) =>
            item.month === month &&
            (item.total_entries > 0 || item.total_exits > 0)
        )
      );
    }

    return months.filter((month) =>
      data.some(
        (item) =>
          `${item.product_id}` === selectedProduct &&
          item.month === month &&
          (item.total_entries > 0 || item.total_exits > 0)
      )
    );
  }, [selectedProduct, data, months]);

  useEffect(() => {
    if (selectedProduct !== "all" && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth("all");
    }
  }, [selectedProduct, availableMonths, selectedMonth]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const productFilter =
        selectedProduct === "all" || `${item.product_id}` === selectedProduct;
      const monthFilter =
        selectedMonth === "all" || item.month === selectedMonth;
      return productFilter && monthFilter;
    });
  }, [data, selectedProduct, selectedMonth]);

  const chartData = useMemo(() => {
    if (!filteredData.length) return null;

    const monthIndices: { [key: string]: number } = {};

    const validMonths = months.filter((month) =>
      filteredData.some(
        (item) =>
          item.month === month &&
          (item.total_entries > 0 || item.total_exits > 0)
      )
    );

    validMonths.forEach((month, index) => {
      monthIndices[month] = index;
    });

    const totalEntries = new Array(validMonths.length).fill(0);
    const totalExits = new Array(validMonths.length).fill(0);

    filteredData.forEach((item) => {
      const monthIndex = monthIndices[item.month];
      if (monthIndex !== undefined) {
        totalEntries[monthIndex] += item.total_entries;
        totalExits[monthIndex] += item.total_exits;
      }
    });

    return {
      labels: validMonths,
      datasets: [
        {
          label: "Entradas",
          data: totalEntries,
          backgroundColor: COLORS.entries.background,
          borderColor: COLORS.entries.border,
          borderWidth: 1,
        },
        {
          label: "Saídas",
          data: totalExits,
          backgroundColor: COLORS.exits.background,
          borderColor: COLORS.exits.border,
          borderWidth: 1,
        },
      ],
    };
  }, [filteredData, months]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Entradas e Saídas por Mês",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataset = tooltipItem.dataset;
            const value = dataset.data[tooltipItem.dataIndex];
            const month = chartData?.labels[tooltipItem.dataIndex];

            const relatedProducts = filteredData
              .filter((item) => item.month === month)
              .map((item) => {
                const quantity =
                  dataset.label === "Entradas"
                    ? item.total_entries
                    : item.total_exits;
                return quantity > 0 ? `${item.product_name}: ${quantity}` : "";
              })
              .filter((item) => item !== "");

            return [`${dataset.label}: ${value}`, ...relatedProducts];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mês",
          font: {
            weight: "bold" as const,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Quantidade",
          font: {
            weight: "bold" as const,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        m: 3,
      }}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid>
          <FormControl fullWidth>
            <InputLabel id="product-filter-label">
              Filtrar por Produto
            </InputLabel>
            <Select
              labelId="product-filter-label"
              id="productFilter"
              value={selectedProduct}
              label="Filtrar por Produto"
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedMonth("all");
              }}
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
            <InputLabel id="month-filter-label">Filtrar por Mês</InputLabel>
            <Select
              labelId="month-filter-label"
              id="monthFilter"
              value={selectedMonth}
              label="Filtrar por Mês"
              onChange={(e) => setSelectedMonth(e.target.value || "all")}
            >
              <MenuItem value="all">Todos os Meses</MenuItem>
              {availableMonths.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, newType) => newType && setChartType(newType)}
            aria-label="Tipo de Gráfico"
          >
            <ToggleButton value="bar" aria-label="Gráfico de Barras">
              <BarChartIcon />
            </ToggleButton>
            <ToggleButton value="line" aria-label="Gráfico de Linhas">
              <ShowChartIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", height: 500 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : chartData ? (
          chartType === "bar" ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <Line data={chartData} options={chartOptions} />
          )
        ) : (
          <Typography variant="body1" align="center" color="textSecondary">
            Não há dados disponíveis para exibição
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardChart;
