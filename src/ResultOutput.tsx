import { Card, CardContent, Typography } from "@mui/material"

interface ResultOutputProps {
    savings: number
    time: number
}

export default function ResultOutput({ savings, time }: ResultOutputProps) {
    return (
        <Card sx={{ marginBottom: 5, bgcolor: 'lightskyblue' }}>
            <CardContent>
                <Typography variant="h4">{savings > 0 ? "Mieten" : "Kaufen"} ist günstiger!</Typography>
                <Typography>Vorteil gegenüber {savings > 0 ? "Kaufen" : "Mieten"} beträgt {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Math.abs(savings))} nach {time} Jahren</Typography>
            </CardContent>
        </Card>
    )
}