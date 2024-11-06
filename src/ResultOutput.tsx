import { Paper, Typography } from "@mui/material"

interface ResultOutputProps {
    savings: number
    time: number
}

export default function ResultOutput({ savings, time }: ResultOutputProps) {
    return (
        <Paper elevation={10} sx={{ padding: 3, marginBottom: 5, bgcolor: 'lightskyblue', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h4">{savings > 0 ? "Mieten" : "Kaufen"} ist günstiger!</Typography>
            <Typography>Vorteil gegenüber {savings > 0 ? "Kaufen" : "Mieten"} beträgt {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Math.abs(savings))} nach {time} Jahren</Typography>
        </Paper>
    )
}