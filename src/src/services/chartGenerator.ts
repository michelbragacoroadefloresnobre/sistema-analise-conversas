import { ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 600
const height = 400
const backgroundColour = "#FFFFFF"
const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour
})

export async function generateBarChart(data: {label: string, value:number}[]) {
    const configuration: ChartConfiguration = {
        type: "bar",
        data: {
            labels: data.map(d => d.label),
            datasets:[{
                label: "Nota Média",
                data: data.map(d => d.value),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: "y",
            scales: {
                x: {
                    beginAtZero: true,
                    max: 10
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Top 3 Funcionarios do Dia"
                }
            }
        }
    }

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration)
    return `data:image/png;base64,${imageBuffer.toString("base64")}`
}