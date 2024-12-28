import { useEffect, useState } from "react";
import {
  getAverageInteractionDurationAllRestaurants,
  getUnderperformingRestaurants,
  getPerformanceScores,
} from "../utils/apis";

import {
  Container,
  Typography,
  Divider,
  Paper,
  Grid,
} from "@mui/material";
import Loader from "./Loader";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Metrics = () => {
  const [
    averageInteractionDurationAllRestaurants,
    setAverageInteractionDurationAllRestaurants,
  ] = useState([]);
  const [underperformingRestaurants, setUnderperformingRestaurants] = useState(
    []
  );
  const [performanceScores, setPerformanceScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const averageInteractionData =
          await getAverageInteractionDurationAllRestaurants();
        const underperformingData = await getUnderperformingRestaurants();
        const performanceData = await getPerformanceScores();

        setAverageInteractionDurationAllRestaurants(averageInteractionData);
        setUnderperformingRestaurants(underperformingData);
        setPerformanceScores(performanceData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Chart Data Preparation
  const averageInteractionChartData = {
    labels: averageInteractionDurationAllRestaurants.map((r) => r.name),
    datasets: [
      {
        label: "Average Duration (minutes)",
        data: averageInteractionDurationAllRestaurants.map(
          (r) => r.average_interaction_duration
        ),
        backgroundColor: "#42a5f5",
        borderColor: "#1e88e5",
        borderWidth: 1,
      },
    ],
  };

  const underperformingChartData = {
    labels: underperformingRestaurants.map((r) => r.name),
    datasets: [
      {
        label: "Time Since Last Interaction (days)",
        data: underperformingRestaurants.map(
          (r) => r.time_since_last_interaction || 0
        ),
        backgroundColor: "#ef5350",
        borderColor: "#d32f2f",
        borderWidth: 1,
      },
    ],
  };

  const performanceScoreChartData = {
    labels: performanceScores.map((r) => r.name),
    datasets: [
      {
        label: "Performance Score",
        data: performanceScores.map((r) => r.performance_score),
        backgroundColor: "#66bb6a",
        borderColor: "#388e3c",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        📊 Restaurant Metrics Dashboard
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            📊 Average Interaction Duration
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Bar
              data={averageInteractionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={200}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            ⚠️ Underperforming Restaurants
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Line
              data={underperformingChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={200}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            🏆 Performance Scores
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Doughnut
              data={performanceScoreChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Metrics;
