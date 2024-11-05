import { Stack, TextField, Tooltip, Icon } from "@mui/material"
import Grid from "@mui/material/Grid2";
import HelpIcon from '@mui/icons-material/Help';

interface DataOutputProps {
    label: string,
    tooltip: string,
    value: number,
    typeHint?: string
}

export default function DataOutput({ label, tooltip, value, typeHint }: DataOutputProps) {
    return (
        <Grid size={{ md: 4 }}>

            <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    disabled
                    value={typeHint === '€' ? Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value) : Math.ceil(value)}
                    label={label}
                    id={label}
                    sx={{ flexGrow: 1 }}
                />
                <Tooltip title={tooltip}>
                    <Icon>
                        <HelpIcon />
                    </Icon>
                </Tooltip>
            </Stack>
        </Grid>
    )
}