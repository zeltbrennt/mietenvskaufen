import { Stack, TextField, Tooltip, Icon, InputAdornment } from "@mui/material"
import Grid from "@mui/material/Grid2";
import HelpIcon from '@mui/icons-material/Help';

interface DataInputProps {
    label: string,
    tooltip: string,
    handleInput: (a: number) => void,
    typeHint?: string,
    defaultValue?: number
}

export default function DataInput({ label, tooltip, handleInput, typeHint, defaultValue }: DataInputProps) {
    return (
        <Grid size={{ md: 4 }}>

            <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    onChange={(event) => {
                        handleInput(Number(event.target.value))
                    }}
                    defaultValue={defaultValue}
                    label={label}
                    id={label}
                    required
                    sx={{ flexGrow: 1 }}
                    slotProps={{
                        input: { endAdornment: <InputAdornment position="end">{typeHint}</InputAdornment> }
                    }} />
                <Tooltip title={tooltip}>
                    <Icon>
                        <HelpIcon />
                    </Icon>
                </Tooltip>
            </Stack>
        </Grid>
    )
}