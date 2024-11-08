import { Box, Paper, Typography } from "@mui/material"

interface ResultOutputProps {
    savings: number
    time: number
}

export default function ResultOutput({ savings, time }: ResultOutputProps) {
    return (
        <Paper elevation={10} sx={{
            padding: 3, marginBottom: 5, bgcolor: time === Infinity ? 'lightcoral' : 'lightskyblue', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
            {time === Infinity ? <Box>
                <Typography variant="h4">🤪 Keine sinnvolle Aussage möglich</Typography>
                <Typography></Typography>
            </Box> : <Box>
                <Typography variant="h4">{savings > 0 ? "😎 Mieten" : "🏡 Kaufen"} ist günstiger!</Typography>
                <Typography>Vorteil gegenüber {savings > 0 ? "Kauf" : "Miete"} beträgt {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Math.abs(savings))} nach {time} Jahren</Typography>
            </Box>
            }
        </Paper >
    )
}