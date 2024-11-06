import { TextField, Tooltip, Icon, InputAdornment } from "@mui/material"
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
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>

            <Grid container spacing={1} alignItems={'center'} >
                <Grid size={10}>

                    <TextField
                        onChange={(event) => {
                            handleInput(Number(event.target.value))
                        }}
                        defaultValue={defaultValue}
                        label={label}
                        id={label}
                        required
                        fullWidth
                        slotProps={{
                            input: { endAdornment: <InputAdornment position="end">{typeHint}</InputAdornment> }
                        }} />
                </Grid>
                <Grid size={2} container justifyContent={'flex-end'}>
                    <Tooltip title={tooltip}>
                        <Icon>
                            <HelpIcon />
                        </Icon>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    )
}