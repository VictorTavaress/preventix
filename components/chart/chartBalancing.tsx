import React, { useRef, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { captureRef } from "react-native-view-shot";
import { useForm } from "~/lib/formContext";
import Svg, { Line } from "react-native-svg";

type VibChartProps = {
  visible?: boolean;
  onCapture?: (base64: string) => void;
};

export const VibChart: React.FC<VibChartProps> = ({
  visible = false,
  onCapture,
}) => {
  const chartRef = useRef<View>(null);
  const { formData } = useForm();
  const { initial1, final1, initial2, final2 } = formData.vibration || {};

  const labels = [
    "Inicial 1",
    "Final 1",
    ...(initial2 != null ? ["Inicial 2", "Final 2"] : []),
  ];

  const data = [
    Number(initial1 || 0),
    Number(final1 || 0),
    ...(initial2 != null ? [Number(initial2), Number(final2)] : []),
  ];

  // índice do maior valor
  const maxIndex = data.indexOf(Math.max(...data));

  // 1) cria array de funções de cor
  const colors = data.map((_, i) => {
    return (_opacity: number) =>
      i === maxIndex ? "rgba(255, 0, 0, 0.5)" : "rgba(9, 139, 113, 0.5)";
  });

  const screenWidth = Dimensions.get("window").width * 0.9;

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: () => "rgb(9, 139, 113)", // fallback
    labelColor: () => "#333",
  };

  useEffect(() => {
    if (!chartRef.current) return;
    const t = setTimeout(async () => {
      try {
        const b64 = await captureRef(chartRef, {
          format: "png",
          quality: 1,
          result: "base64",
        });
        const finalBase64 = `data:image/png;base64,${b64}`; // aqui junta o prefixo
        onCapture?.(finalBase64);
      } catch (e) {
        console.error("Erro ao capturar gráfico:", e);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [initial1, final1, initial2, final2]);

  return (
    <View
      ref={chartRef}
      collapsable={false}
      style={{
        position: visible ? "relative" : "absolute",
        top: visible ? 0 : -1000,
        left: visible ? 0 : -1000,
        width: screenWidth,
        height: 240,
      }}
    >
      <BarChart
        data={{
          labels,
          datasets: [
            {
              data,
              colors, // array de funções
            },
          ],
        }}
        width={screenWidth}
        height={240}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        withCustomBarColorFromData // habilita usar `colors`
        flatColor // aplica sem degradê
        yAxisLabel=""
        yAxisSuffix=""
      />
      <Svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={screenWidth}
        height={240}
      >
        <Line
          x1={screenWidth * 0.1}
          y1={240 - (data[0] / Math.max(...data)) * 240}
          x2={screenWidth * 0.9}
          y2={240 - (data[data.length - 1] / Math.max(...data)) * 240}
          stroke="rgba(1,153,157,0.8)"
          strokeDasharray="5"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};
